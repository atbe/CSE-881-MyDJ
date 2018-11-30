import tensorflow as tf
import numpy as np
from scipy import sparse
from tffm import TFFMRegressor


class ArtistResponse(object):
    def __init__(self):
        self.model = TFFMRegressor(
            optimizer=tf.train.AdamOptimizer(learning_rate=0.01),
            n_epochs=1000,
            input_type='sparse'
        )

        self.model.load_state("")

    def generate_feature_matrix(self, info, artist_names, column_map):
        # We create a matrix of feature vectors for each potential artist
        X = np.zeros((len(artist_names), len(column_map)))

        # Feature matrix will have the same values for the user information fields
        X[:, 0] = info["age"]
        X[:, 1] = info["signup"]
        X[:, column_map[f"country_{info['country']}"]] = 1
        X[:, column_map[f"gender_{info['gender']}"]] = 1

        # Set the proper one-hot vector for artist
        for i, name in enumerate(artist_names):
            X[i, column_map[f"artistName_{name}"]] = 1

        return sparse.csr_matrix(X)

    def get_top_predicted_artists(self, info, n=10):
        top_artists = None
        column_map = None
        X = self.generate_feature_matrix(info, top_artists, column_map)
        predictions = self.model.predict(X)
        predicted_artists = list(map(lambda artist: top_artists[artist], np.argsort(predictions)[::-1]))
        return predicted_artists[:n]
