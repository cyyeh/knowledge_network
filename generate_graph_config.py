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
        with open(dotIO_posts_path + f, mode='r', encoding='utf8') as file_descriptor:
            lines = file_descriptor.read().splitlines()
            analysis = {
                "tags": [],
                "category": "",
                "link": "",
                "description": ""
            }
            filter_tags_set = {'in process', 'finished', 'waited'}
            read_tags_flag = False
            read_categories_flag = False
            read_description_flag = False
            description = ""
            title = ""
            for line in lines:
                if "title:" in line:
                    title = line.split("title: ")[-1]
                elif "tags:" in line:
                    read_tags_flag = True
                    read_categories_flag = False
                elif "categories:" in line:
                    read_tags_flag = False
                    read_categories_flag = True
                elif "description:" in line:
                    read_categories_flag = False
                    read_description_flag = True
                    description = line.split("description: ")[-1]
                else:
                    content = line.split("- ")[-1]
                    if read_tags_flag and content not in filter_tags_set:
                        analysis["tags"].append(content)
                        if content not in total_analysis["tags"]:
                            total_analysis["tags"].append(content)
                    elif read_categories_flag:
                        analysis["category"] = content
                    elif read_description_flag:
                        if "---" == line or "top:" in line:
                            break
                        else:
                            description += line

            analysis["link"] = f.split(".md")[0]
            analysis["description"] = description
            total_analysis["posts_with_tags"][title] = analysis

# convert dictionary type to json data
# save json data to docs/
with open("docs/total_analysis.json", mode="w") as f:
    json.dump(total_analysis, f)