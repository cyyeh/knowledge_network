# parse blog posts locally to generate network nodes and edges and save it to a json file
import os
import json

dotIO_posts_path = "/Users/chihyu/Desktop/TYCS/dotIO/source/_posts/"
directory = os.listdir(dotIO_posts_path)
total_analysis = {
    "posts_with_tags": {},
    "tags": []
}

# parse categories and tags inside each blog post
for f in directory:
    if f.endswith(".md"):  # check if it's real blog post file
        with open(dotIO_posts_path + f, mode='r') as file_descriptor:
            lines = file_descriptor.read().splitlines()
            analysis = {
                "tags": []
            }
            filter_tags_set = {'in process', 'finished', 'waited'}
            read_tags_flag = False
            for line in lines:
                if "tags:" in line:
                    read_tags_flag = True
                    read_categories_flag = False
                elif "categories:" in line:
                    break
                else:
                    content = line.split("- ")[-1]
                    if read_tags_flag and content not in filter_tags_set:
                        analysis["tags"].append(content)
                        if content not in total_analysis["tags"]:
                            total_analysis["tags"].append(content)
                            
            total_analysis["posts_with_tags"][f] = analysis

# convert dictionary type to json data
# save json data to docs/
with open("docs/total_analysis.json", mode="w") as f:
    json.dump(total_analysis, f)