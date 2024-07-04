# %%
import opencc
import re

t2s = opencc.OpenCC("t2s")

paths_of_docs = [
    "/index.md",
    "/docs/introduction.md",
    "/docs/variables.md",
    "/docs/types.md",
    "/docs/ownership.md",
]

for path_of_doc in paths_of_docs:
    with open("../src/zht" + path_of_doc, mode="r", encoding="utf8") as temp:
        doc = temp.read()
    if not doc.startswith("<!-- do not translate -->"):
        pat = re.compile(
            r"((?:<!-- do not translate -->[\S\s]+?<!-- do not translate -->)|(?:`.+?`)|(?:<.+?>)|(?:[^`<>]+)|(?:[\r\n]+)|(?:[<>]))+?"
        )
        res = re.findall(pat, doc)
        res_zht = []
        for i in res:
            if i.startswith("`") or i.startswith("<"):
                res_zht.append(i)
            else:
                res_zht.append(t2s.convert(i))
        output = "".join(res_zht)
        print(path_of_doc, "translated.")
    else:
        output = doc
        print(path_of_doc, "not translated.")
    output = output.replace("/zht/", "/")
    output = output.replace("link: index", "link: /zht/index")
    with open("../src" + path_of_doc, mode="w", encoding="utf8") as temp:
        temp.write(output)

# %%
