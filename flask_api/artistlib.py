import numpy as np
from scipy import sparse
from tffm import TFFMRegressor
import tensorflow as tf


class ArtistResponse(object):
    def __init__(self):
        self.model = TFFMRegressor(
            optimizer=tf.train.AdamOptimizer(learning_rate=0.01),
            n_epochs=1000,
            input_type='sparse'
        )

    def generate_feature_matrix(self, info, artist_names, favored_artists, column_map):
        """
        Generate the feature matrix
        :param info: User information
        :param artist_names: Artists we want to predict for
        :param column_map: Feature vector column mapping
        :return: sparse feature matrix
        """
        # We create a matrix of fea ture vectors for each potential artist
        X = np.zeros((len(artist_names), len(column_map)))

        # Feature matrix will have the same values for the user information fields
        X[:, 0] = info["age"]
        X[:, column_map[f"country_{info['country']['name']}"]] = 1

        if info["gender"] is not None:
            X[:, column_map[f"gender_{info['gender']}"]] = 1

        # Set the proper one-hot vector for artist
        for i, name in enumerate(favored_artists):
            X[i, column_map[f"artistName_{name}"]] = 1

        return sparse.csr_matrix(X)

    def get_top_predicted_artists(self, info, column_map, top_artists, n=10):
        """
        Get the top predicted artists for a user
        :param info: User information
        :param column_map: Feature vector column mapping
        :param top_artists: Artists we want to predict for
        :param n: How many artists we want to return
        :return: list of the top predicted artists in descending order
        """
        X = self.generate_feature_matrix(info, top_artists, info["artists_names"], column_map)
        self.model.core.set_num_features(X.shape[1])
        self.model.load_state("tffm_model/")
        predictions = self.model.predict(X)
        predicted_artists = list(map(lambda artist: top_artists[artist], np.argsort(predictions)[::-1]))
        return predicted_artists[:n]
