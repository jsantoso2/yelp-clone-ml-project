import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from math import cos, asin, sqrt
import numpy as np
from datetime import datetime
import re
import uuid
import urllib.request
import os

import torch
import torch.nn as nn
from transformers import BertTokenizer, BertModel

from flask import Flask, jsonify, request, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Use a service account
cred = credentials.Certificate('serviceAccount.json')
firebase_admin.initialize_app(cred)

# initialize database
db = firestore.client()


############################################## MACHINE LEARNING BERT MODEL methods
# clean text for processing
def clean_text(tokenizer, text):
    # basic text preprocessing
    text = text.replace("''", '" ').replace("``", '" ')  # replace the quotes 
    text = text.replace("`", "'") # backticks typo
    text = text.replace("\"", "") # replace quotes
    text = text.replace("...", " ").replace(". . .", " ").replace('..', ' ') # replace dots
    text = text.replace("\n", " ") # replace new line chars
    text = re.sub(r'(?:http:|https:).*?(?=\s)', '', text)  # remove url and website
    text = re.sub(r'www.*?(?=\s)', '', text)  # remove url and website

    list_to_replace = [':(', '=)', ':)', ':P', '-', ',,', ':', ';', '/', '+', '~', '_', '*', '(', ')', '&', '=', '@'] #replace the punctuations which are messy with empty
    for elem in list_to_replace:
        text = text.replace(elem, '')
    
    text = re.sub(r'\!{2,}', '!', text) # duplicate punctuation
    text = re.sub(r'\?{2,}', '?', text) # duplicate punctuation
    text = text.replace('?!', '?').replace('!?', '?') #replace slang punctuation with question
    text = re.sub(r'\s(?:\.|\,)', '', text) # replace spaces before punctuation
    text = re.sub(r'([a-zA-Z?!])\1\1+', r'\1', text) # removes repeated characters (Ex: Veryyyyy -> very)
    
    text = re.sub(r'\s{2,}', ' ', text) # replace multiple spaces
    text = text.strip() # strips spaces

    text = text.lower() # lower text

    return text

def pad_sent(tokenizer, raw_text, max_text_len = 350):  #token number 0 is [PAD]
    curr_text = "[CLS] " + raw_text  # add starting cls token
    tokenized_text = tokenizer.tokenize(curr_text) # tokenize            
    tokenized_ids = tokenizer.convert_tokens_to_ids(tokenized_text) # convert to ids

    tokenized_ids = tokenized_ids[:max_text_len - 1]   # trim the reviews
    tokenized_ids.append(102) # add special token for [SEP]
    
    # get text length and padding
    curr_sent_len = len(tokenized_ids)
    remaining = max_text_len - curr_sent_len # words remaining for padding

    # pad the input token
    tokenized_ids.extend([0] * remaining)  # pad the text to max_text_len

    # create attention and segmented mask
    curr_attn = [1] * curr_sent_len  
    curr_attn.extend([0] * remaining)
    curr_seg_id = [0] * max_text_len

    return tokenized_ids, curr_attn, curr_seg_id

def get_available_devices():
    """Get IDs of all available GPUs.

    Returns:
        device (torch.device): Main device (GPU 0 or CPU).
        gpu_ids (list): List of IDs of all GPUs that are available.
    """
    gpu_ids = []
    if torch.cuda.is_available():
        gpu_ids += [gpu_id for gpu_id in range(torch.cuda.device_count())]
        device = torch.device(f'cuda:{gpu_ids[0]}')
        torch.cuda.set_device(device)
    else:
        device = torch.device('cpu')

    return device, gpu_ids

def do_prediction(device, tokenizer, model, test_string):
    # test string + preprocess
    test_string = clean_text(tokenizer, test_string)
    tokenized_ids, curr_attn, curr_seg_id = pad_sent(tokenizer, test_string)

    with torch.no_grad():
        # Setup for forward
        text = torch.tensor(tokenized_ids).to(device)
        attnmask = torch.tensor(curr_attn).to(device)
        seg_id = torch.tensor(curr_seg_id).to(device)

        text = torch.reshape(text, (1, -1))
        attnmask = torch.reshape(attnmask, (1, -1))
        seg_id = torch.reshape(seg_id, (1,-1))

        # Forward
        logits = model(text, seg_id, attnmask)
        
        return logits  # just return logits
        

# create tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased-tokenizer')
# tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# load model
device, gpu_ids = get_available_devices()

# load from final model
# if 'best-model-180000.pth' not in os.listdir():
    # print("downloading model! not present in current directory")
    # url = 'https://storage.googleapis.com/yelp_sentiment_analysis_model_jonathan/best-model-180000.pth'
    # urllib.request.urlretrieve(url, 'best-model-180000.pth')
    # model = torch.jit.load("best-model-180000.pth")
# else:
    # print("model present in current directory")
    # model = torch.jit.load("best-model-180000.pth")

model = torch.jit.load("best-model-180000.pth")
model = model.to(device)
model.eval()
print('Load Model Done!')
##############################################

############################################### API Methods

# check if server is running
@app.route('/',methods=['GET'])
def get():
    return jsonify({'msg': 'Server running'})


# route to get all businesses for search
@app.route('/getAllBusiness', methods=['GET'])
def getAllBusiness():
    if request.method == 'GET':
        docs = db.collection('business').get()
        response_body = [doc.to_dict() for doc in docs]
        return make_response(jsonify(response_body), 200)
    else:
        return make_response(jsonify({"message": "Method not implemented only GET is allowed"}, 400))    


# route to get 3 nearest businesses
# lat long needs to be passed on as parameters in url for get
# to get three nearest business http://localhost:5000/getThreeNearestBusiness?lat=40.7128&lon=74.0060
@app.route('/getThreeNearestBusiness', methods=['GET'])
def getThreeNearestBusiness():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    v = {'lat': float(lat), 'lon': float(lon)}
    
    # Find closest distance using Haversine Formula    
    def distance(lat1, lon1, lat2, lon2):
        p = 0.017453292519943295
        a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
        return 12742 * asin(sqrt(a))
    
    # find 3 closest data points
    def closest(data, v):
        dist = [distance(v['lat'], v['lon'], elem['latitude'], elem['longitude']) for elem in data]
        idx = np.argsort(dist)[:3]
        return list(np.take(data, idx))
    
    if request.method == 'GET':
        docs = db.collection('business').get()    
        returned_list = [doc.to_dict() for doc in docs]
        closest_businesses = closest(returned_list, v)
        return make_response(jsonify(closest_businesses), 200)
    else:
        return make_response(jsonify({"message": "Method not implemented only GET is allowed"}, 400))    


# route to get one business data
# to get one business data http://localhost:5000/getOneBusinessData?business_id=4o2DEgSgY2sDZ16g6U03-w
@app.route('/getOneBusinessData', methods=['GET'])
def getOneBusinessData():
    business_id = request.args.get("business_id")
    
    # clean up open and close hours
    def convert_time(x):
        if x == "0:0-0:0":
            return "Closed"
  
        open_time = x.split('-')[0]
        close_time = x.split('-')[1]

        # process open time 
        answer_open = ""
        digit_open_time = open_time.split(':')[0]
        ending_open = ""
        if len(open_time.split(':')[1]) == 2:
            ending_open = open_time.split(':')[1]
        else:
            ending_open = open_time.split(':')[1] + "0"
            
        if int(digit_open_time) < 12:
            answer_open += digit_open_time + ":" + ending_open + " am"
        elif int(digit_open_time) == 12:
            answer_open += digit_open_time + ":" + ending_open + " pm"
        else:
            answer_open += str(int(digit_open_time) - 12) + ":" + ending_open + " pm"
  
        # process close time
        answer_close = ""
        digit_close_time = close_time.split(':')[0]
        ending_close = ""
        if len(close_time.split(':')[1]) == 2:
            ending_close = close_time.split(':')[1]
        else:
            ending_close = close_time.split(':')[1] + "0"

        if int(digit_close_time) < 12:
            answer_close += digit_close_time + ":" + ending_close + " am"
        elif int(digit_close_time) == 12:
            answer_close += digit_close_time + ":" + ending_close + " pm"
        else:
            answer_close += str(int(digit_close_time) - 12) + ":" + ending_close + " pm"
            
        # return answer
        return answer_open + '-' + answer_close
    
    
    if request.method == 'GET':
        docs = db.collection('business').where('business_id', '==', business_id).get()
        response_body = docs[0].to_dict()
        
        # iterate through all the hours to clean up the hours
        for elem in response_body['hours'].keys():
            response_body["hours"][elem] = convert_time(response_body["hours"][elem])
        return make_response(jsonify(response_body), 200)
    else:
        return make_response(jsonify({"message": "Method not implemented only GET is allowed"}, 400))    
 

# route to get one business review joined with user data
# to get one business data http://localhost:5000/getOneBusinessReview?business_id=4o2DEgSgY2sDZ16g6U03-w
@app.route('/getOneBusinessReview', methods=['GET'])
def getOneBusinessReview():
    business_id = request.args.get("business_id")
    
    if request.method == 'GET':
        docs = db.collection('ratings').where('business_id', '==', business_id).get()
        reviews_list = [doc.to_dict() for doc in docs]
        all_user_id = [review['user_id'] for review in reviews_list]
        review_ids = [review['id'] for review in reviews_list]
        
        users_info = [db.collection('users').where('user_id', '==', userid).get()[0].to_dict() for userid in all_user_id]
        
        # combine both dictionaries
        [review.update(users_info[idx]) for idx, review in enumerate(reviews_list)]
        # need to revert back reviewids because it is overwritten
        for idx, review in enumerate(reviews_list):
            review["id"] = review_ids[idx]
        
        # sort reviews by date and clean up date
        all_dates = [review['date'] for review in reviews_list]
        all_dates = [datetime.strptime(elem, '%Y-%m-%d %H:%M:%S') for elem in all_dates]
        sorted_idx = np.argsort(all_dates)[::-1]  # need to reverse argsort, want newest first
                
        # reindex list by list python
        final = [reviews_list[i] for i in sorted_idx] 

        # convert date into mm/dd/YYYY format
        for elem in final:
            elem["date"] = datetime.strptime(elem["date"], '%Y-%m-%d %H:%M:%S').strftime("%m/%d/%Y")
                
        return make_response(jsonify(final), 200)
        
    else:
        return make_response(jsonify({"message": "Method not implemented only GET is allowed"}, 400))    


# route to get one user data info
# to get one user data http://localhost:5000/getOneUserData?user_id=Iq9EiUS7FmFB6Uw3PBghsQ
@app.route('/getOneUserData', methods=['GET'])
def getOneUserData():
    user_id = request.args.get("user_id")
    
    if request.method == 'GET':
        docs = db.collection('users').where('user_id', '==', user_id).get()
        response_body = docs[0].to_dict()
        
        # clean the yelping since date
        response_body["yelping_since"] = datetime.strptime(response_body["yelping_since"], '%Y-%m-%d %H:%M:%S').strftime("%B %Y")
            
        return make_response(jsonify(response_body), 200)
    else:
        return make_response(jsonify({"message": "Method not implemented only GET is allowed"}, 400))    


# route to get one user review joined with businesss data
# to get one business data http://localhost:5000/getOneUserReview?user_id=Iq9EiUS7FmFB6Uw3PBghsQ
@app.route('/getOneUserReview', methods=['GET'])
def getOneUserReview():
    user_id = request.args.get("user_id")
    
    if request.method == 'GET':
        docs = db.collection('ratings').where('user_id', '==', user_id).get()
        reviews_list = [doc.to_dict() for doc in docs]
        all_business_id = [review['business_id'] for review in reviews_list]
        review_ids = [review['id'] for review in reviews_list]
        
        business_info = [db.collection('business').where('business_id', '==', businessid).get()[0].to_dict() for businessid in all_business_id]
        
        # combine both dictionaries
        [review.update(business_info[idx]) for idx, review in enumerate(reviews_list)]
        # need to revert back reviewids because it is overwritten
        for idx, review in enumerate(reviews_list):
            review["id"] = review_ids[idx]
        
        # sort reviews by date and clean up date
        all_dates = [review['date'] for review in reviews_list]
        all_dates = [datetime.strptime(elem, '%Y-%m-%d %H:%M:%S') for elem in all_dates]
        sorted_idx = np.argsort(all_dates)[::-1]  # need to reverse argsort, want newest first
                
        # reindex list by list python
        final = [reviews_list[i] for i in sorted_idx] 

        # convert date into mm/dd/YYYY format
        for elem in final:
            elem["date"] = datetime.strptime(elem["date"], '%Y-%m-%d %H:%M:%S').strftime("%m/%d/%Y")
                
        return make_response(jsonify(final), 200)
    
    else:
        return make_response(jsonify({"message": "Method not implemented only GET is allowed"}, 400))    


# post method to post review
@app.route('/postreview', methods=['POST', 'GET'])
def postreview():
    if request.method == 'POST':
        if request.is_json:
            db.collection("ratings").add(request.json)
            
            sent_data = request.json            
            # request.json format
            # {'business_id': '4o2DEgSgY2sDZ16g6U03-w', 'cool': 0, 'date': '2020-8-14 16:0:56', 'funny': 0, 'id': 9999, 'rating': 0, 'text': 'test review', 'useful': 0, 'user_id': 'admin'}
            
            ## need to update review_count and average_stars in users!!!!  We should also do it in business for ratings and review_count but not this time!
            user_doc = db.collection("users").where('user_id', '==', sent_data["user_id"]).get()
            id = user_doc[0].id
            
            old_user_data = user_doc[0].to_dict()
            old_review_count = old_user_data["review_count"]
            old_average_stars = old_user_data["average_stars"]
            
            if old_review_count == 0:
                new_avg_stars = sent_data["rating"]
            else:
                new_avg_stars = round((old_average_stars * old_review_count + sent_data["rating"]) / (old_review_count + 1), 2)
            new_review_count = old_review_count + 1
            
            user_doc = db.collection("users").document(id)

            # update the field
            user_doc.update({"average_stars": new_avg_stars, "review_count": new_review_count})  
                
            return make_response(jsonify({"message": "Review successfully posted!"}), 200)
        else:
            return make_response(jsonify({"message": "Request body must be JSON"}), 400)
    else:
        return make_response(jsonify({"message": "Method not implemented POST is allowed"}), 400)
        

# post method for login
# http://localhost:5000/authenticateLogin
@app.route('/authenticateLogin', methods=['POST'])
def authenticateLogin():
    if request.method == 'POST':
        if request.is_json:
            docs = db.collection("users").where("email", "==", request.json["email"]).get()
            data = docs[0].to_dict()
            
            # validate login
            if (data["email"] == request.json["email"] and data["password"] == request.json["password"]):
                return make_response(jsonify({"message": "Success!", "name": data["name"], "user_id": data["user_id"]}), 200)
            else:
                return make_response(jsonify({"message": "Login Failed! Please check email/password and try again!"}))
                
        else:
            return make_response(jsonify({"message": "Request body must be JSON"}), 400)
    else:
        return make_response(jsonify({"message": "Method not implemented POST is allowed"}), 400)



# post method for sign up user
# http://localhost:5000/signupuser
@app.route('/signupuser', methods = ['POST'])
def signupuser():
    if request.method == 'POST':
        if request.is_json:
            sent_data = request.json  # sent over data
            
            data = {}
            # need to complete other attributes
            data["average_stars"] = 0
            data["cool"] = 0
            data["elite"] = ""
            data["email"] = sent_data["email"]
            data["fans"] = 0
            data["friends"] = 0
            data["funny"] = 0
            data["id"] = 9999
            if sent_data["lastname"] == "":
                data["name"] = sent_data["firstname"]
            elif sent_data["firstname"] == "":
                data["name"] = sent_data["lastname"]
            else:
                data["name"] = sent_data["firstname"] + " " + sent_data["lastname"]
            
            data["password"] = sent_data["password"]
            data["profilepic"] = "https://bestnycacupuncturist.com/wp-content/uploads/2016/11/anonymous-avatar-sm.jpg"
            data["review_count"] = 0
            data["useful"] = 0
            data["user_id"] = uuid.uuid4().hex # use random hash value???
            data["yelping_since"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # add to firestore
            db.collection("users").add(data)
            return make_response(jsonify({"message": "User Added!", "name": data["name"], "user_id": data["user_id"]}), 200)
            
        else:
            return make_response(jsonify({"message": "Request body must be JSON"}), 400)
    else:
        return make_response(jsonify({"message": "Method not implemented POST is allowed"}), 400)




############ WARNING!!!!!!!!!!! only admin privilages
# to get one user data http://localhost:5000/deleteUserReviews?user_id=admin
@app.route('/deleteUserReviews', methods=['DELETE'])
def deleteUserReviews():
    user_id = request.args.get("user_id")
    
    if request.method == 'DELETE':
        docs = db.collection("ratings").where('user_id', '==', user_id).get()
        doc_ids = [elem.id for elem in docs]
        print("docs_ids", doc_ids)
        
        for id in doc_ids:
            db.collection('ratings').document(id).delete()
        
        return make_response(jsonify({"message": "Review successfully deleted!"}), 200)
    else:
        return make_response(jsonify({"message": "Method not implemented DELETE is allowed"}), 400)


# to delete one user
# to get one user data http://localhost:5000/deleteOneUser?name=test
@app.route('/deleteOneUser', methods=['DELETE'])
def deleteUser():
    name = request.args.get("name")
    if request.method == 'DELETE':
        docs = db.collection("users").where('name', '==', name).get()
        doc_ids = [elem.id for elem in docs]
        
        for id in doc_ids:
            db.collection('users').document(id).delete()
        
        return make_response(jsonify({"message": "User successfully deleted!"}), 200)
    else:
        return make_response(jsonify({"message": "Method not implemented DELETE is allowed"}), 400)
    
    

############################# ML method for prediction
@app.route('/predict', methods=['POST', 'GET'])
def predict():
    if request.method == 'POST':
        if request.is_json:
            test_string = request.json['text']
            logits = do_prediction(device, tokenizer, model, test_string)
            
            # apply softmax to the logits returned by model
            softmax_layer = nn.Softmax(dim=1)
            proba = softmax_layer(logits)
            proba = proba.tolist()[0]  # [0.2, 0.2, 0.2, 0.2, 0.2]
            
            # ypred, Need to add 1 because the model labels goes from 0 to 4 instead of 1 to 5
            ypred = torch.argmax(logits, dim = 1)
            stars = ypred.item() + 1
            
            response_body = {'proba': proba, 'ratings': stars}
            
            return make_response(jsonify(response_body), 200)
        else:
            return make_response(jsonify({"message": "Request body must be JSON"}), 400)
    else:
        return make_response(jsonify({"message": "Method not implemented POST is allowed"}), 400)

    
if __name__ == '__main__':
    # to run locally use this
    # app.run()
    # to deploy to google cloud platform use this
    app.run(port=8080)