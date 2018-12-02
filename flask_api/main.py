# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python37_app]
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.contrib.cache import SimpleCache
from artistlib import ArtistResponse
import pickle
import random
import math

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": ["http://localhost:4200", "https://cse-881-mydj.firebaseapp.com"]}})
cache = SimpleCache()


@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return 'Hello World! TEst ok'


@app.route('/top_artists_random')
def get_top_artists_random():
    seed = request.args.get("seed", type=int)
    count = request.args.get("count", 100, type=int)
    if seed is not None:
        random.seed(seed)

    top_artists = cache.get('top-artists')

    if top_artists is None:
        top_artists = pickle.load(open('top_artists.pickle', 'rb'))
        cache.set('top-artists', top_artists, timeout=5 * 60)

    return jsonify(random.sample(top_artists, count))


@app.route("/top_n_artists")
def get_top_n_artists():
    info = request.args.get("info", type=dict)
    num_artists = request.args.get("num_artists", type=int)

    # age = request.args.get("age", type=int)
    # country = request.args.get("country", type=str)
    # gender = request.args.get("gender", type=str)
    # info = {"age": age, "country": country, "gender": gender}

    column_map = pickle.load(open('column_map.pickle', 'rb'))
    top_artists = pickle.load(open('top_artists.pickle', 'rb'))

    ar = ArtistResponse()
    return jsonify(ar.get_top_predicted_artists(info, column_map, top_artists, num_artists))


@app.route('/get_max_page')
def get_max_page():
    page_size = request.args.get("pageSize", 100, type=int)
    top_artists = cache.get('top-artists')

    if top_artists is None:
        top_artists = pickle.load(open('top_artists.pickle', 'rb'))
        cache.set('top-artists', top_artists, timeout=5 * 60)

    return jsonify(math.ceil(len(top_artists)/page_size))


@app.route('/top_artists')
def get_top_artists():
    page_size = request.args.get("pageSize", 100, type=int)
    page_num = request.args.get("pageNum", 0, type=int)

    top_artists = cache.get('top-artists')

    if top_artists is None:
        top_artists = pickle.load(open('top_artists.pickle', 'rb'))
        cache.set('top-artists', top_artists, timeout=5 * 60)

    start_index = page_num * page_size;
    end_index = start_index + page_size;

    return jsonify(top_artists[start_index:end_index])


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
