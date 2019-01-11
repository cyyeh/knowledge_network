# parse blog posts locally to generate network nodes and edges and save it to a json file
import os

dotIO_posts_path = "/Users/chihyu/Desktop/TYCS/dotIO/source/_posts"
directory = os.listdir(dotIO_posts_path)



for f in directory:
    if f.endswith(".md"):  # check if it's real blog post file
       print(f) 