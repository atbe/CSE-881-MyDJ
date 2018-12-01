# appengine_config.py
from google.appengine.ext import vendor
import zipfile

# Unzip our large libraries from the lib directory of the project
# we divided the packages into two files
zip_locations = ["/lib/lib1.zip", "/lib/lib2.zip", "/lib/tensorflow/tf1.zip", "/lib/tensorflow/tf2.zip",
                 "/lib/scipy/scipy1.zip", "/lib/scipy/scipy2.zip"]

for file in zip_locations:
    with zipfile.ZipFile(file, "r") as zip_ref:
        zip_ref.extractall(file[:file.rfind("/") + 1])

# Add any libraries install in the "lib" folder.
vendor.add('lib')
