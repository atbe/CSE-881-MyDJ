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
from artistlib import ArtistResponse
import pickle
import random

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)


@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return 'Hello World! TEst ok'


@app.route('/top_artists')
def get_top_artists():
    seed = request.args.get("seed", type=int)
    count = request.args.get("count", 100, type=int)
    if seed is not None:
        random.seed(seed)

    top_artists = pickle.load(open('top_artists.pickle', 'rb'))


@app.route("/top_n_artists")
def get_top_n_artists():
    info = request.args.get("info", type=dict)
    num_artists = request.args.get("num_artists", type=int)

    info = {
        "age": 21,
        "gender": "m",
        "country": "United States",
        "likedArtists": [
            "beyonce",
            "drake"
        ]
    }
    column_map = pickle.load(open('column_map.pickle', 'rb'))
    top_artists = pickle.load(open('top_artists.pickle', 'rb'))

    ar = ArtistResponse()
    return str(ar.get_top_predicted_artists(info, column_map, top_artists, num_artists))


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
