# Ownership

## Introduction

Mojo introduces Rust's ownership checking feature and the so-called **value semantics** to better manage memory and prevent issues such as use-after-free, double-free, and memory leaks. Although learning ownership takes some time, once mastered, it effectively reduces mental burden during programming.

The core of the "ownership" world is that any value (a piece of memory) has an **owner**, which has exclusive power to determine the death of the value. For example, a variable name is the owner of a value. Once the variable name is no longer used (dies), then the associated value is also destroyed (lifetime ends). The purpose of introducing ownership is to ensure that the **value** is valid during its owner's lifetime and that all references and modifications to the value do not exceed this lifetime.

The descriptions above sounds ver difficult to understand. Thus, we need some examples that are more familiar to us.

In the following sections, I will introduce a conceputual social model. Later, I will demonstrate how this model can be linked with programming.

## A conceptual social model

There is an island surrouned by water. It is completed owned by a governer. The governer is very wise and want to build a big encyclopedia in one year, from 1 January to 31 December. For this purpose, he need some resources.

The first type of resouce is **notebook** which can be used for drafting. Luckily, there is a number of notebooks on the island. Each notebook contains a specific type of information, e.g., a number, a character, a peom, or the location of another notebook. The governer knows the exact locations of all notebooks, can change the texts on them, but cannot destroy them.

The second type of resoure is **worker**. The governer needs workers to help him fulfilling this dream. Luckily, the island is not far from a famous university, so there are almost unlimited people who are educated enough to help him.

The governer's power on the island is huge. He can freely bring persons in out out of the island, he can assgin notebooks to workers, he can write something on notebooks himself, and he can ask workers to write something on notebooks.

However, everything to be done within this year should be planned beforehand. After the work starts, the workers, as well as the governer, have to act according to the plan. If something goes wrong in the middle, the projects starts again.

The governer carefully divided the tasks into pieces, and made a complicated plan, e.g., on which day he needs to bring in more people, on which day who should do what, on which day who can leave the island.

Initially, the governer set up the following rules of planning:

::: tip Rules of planning version 1

1. Every worker is assigned and owns a notebook.
1. Every worker can modify the texts on notebooks.
1. Every worker returns the notebook when he leaves the island.

:::

After setting up the house rules, the governer could not wait to start the work. Soon, he found out something was not working well.

::: warning Problem 1: Too much copying

Workers cannot access the notebook from others. When they want to read the information on other notebooks, the governer has to first copy the texts for them. This is too much work for the governer and it is not efficient at all. The work cannot be done in one year.

:::

Thus, the governer decided to add one item to the rules and restart the work:

::: tip Rules of planning version 2

1. Every worker is assigned and owns a notebook.
1. Every worker can modify the texts on notebooks.
1. Every worker returns the notebook when he leaves the island.
1. (new) A worker can assess to another notebook if he knows the the location of that notebook.

:::

Now workers are happy, so is the governer. As long as the workers know the location of another notebook, they can access to that notebook as well as the information on it. The governer does not need to make a copy every time.

The work started again. Everything looked so good. But after some time, the governer detected other problems.

::: warning Problem 2: Do not change my texts!

**Worker A** owns **Notebook X**, which records numbers. On 15 January, **Worker A** suddenly noticed that the number on the notebook was modified from 1 to 1000. This is not intended at all!

They came to the governer and reported this issue. The governer checked the planning, and found out the reason:  

**Worker B** knows the location of **Notebook X** too (the location of **Notebook X** is written in the notebook of **Worker B**). In principal, **Worker B** shall only read **Notebook X** but not modify the number on it. However, the governer made a mistake in the planning which asks **Worker B** to change the number on **Notebook X** on 15 January.

:::

To avoid this kind of problem, the govener modified the house rules so that workers can only read other notebooks. If they want to modify other notebooks, they need special permission.

::: tip Rules of planning version 3

1. Every worker is assigned and owns a notebook.
1. (changed) Every worker can modify the texts on their own notebook.
1. Every worker returns the notebook when he leaves the island.
1. A worker can read another notebook if he knows the the location of that notebook.
1. A worker can write on another notebook if he knows the the location of that notebook and has a special permission.

:::

Workers cannot modify other notebooks without permissions. This is good. But then another problem occured.

::: warning Problem 3: Use of notebook after reassignment

**Worker A** is planned to read **Notebook X** on 1 March and come back to the governer with what he sees. **Notebook X** belongs to **Worker B**, and there should be a peom on it.

**Worker A** came back soon, telling the governer that there was a nunmber on **Notebook X**, instead of a peom.

The governer was shocked. He checked all records and found out the reason:

- **Notebook X** is assigned to **Worker B** to hold a peom on 1 January.
- **Worker B** finishes his work and leave the island on 1 February. The governer takes back the **Notebook X** from **Worker B**.
- **Notebook X** is re-assigned to **Worker C** to record a number on 15 February.
- **Worker A** is assigned to read **Notebook X** as a peom on 1 March.

That is way **Worker A** got a number instead not a peom. He used the notebook after reassignment.

:::

The governer want to avoid this problem. He decided that, if a worker wants to access to another notebook, he must do this via the owner of the notebook. At the planning stage, the governer checkes whether the owner left the island before other worker assess the notebook.

He modified the house rule as follows:

::: tip Rules of planning version 4

1. Every worker is assigned and owns a notebook.
1. Every worker can modify the texts on their own notebook.
1. Every worker returns the notebook when he leaves the island.
1. (changed) A worker can read another notebook if he knows the owner of that notebook.
1. (changed) A worker can write on another notebook if he knows the owner of that notebook and has a special permission.
1. (new) A worker should not leave the island if other workers are planned to read or write on his notebook in future.

:::

Now the problem is resolved: At the planning stage, **Worker A** is planned to read **Worker B's notebook** on 1 March and come back to the governer with what he sees. Governer then checks the stay-time of **Worker B** on the island. He notices that **Worker B** is planned to leave the island on 1 February. This violates the house rules. He then extend the stay of **Worker B** until 1 March.

The governer restarts the project again at 1 January. Things go well until 30 June.

::: warning Problem 5: Insufficient notebooks

On 30 June, the governer suddently found there were insufficient notebooks on the island. Within days, new workers are not able to recieve a notebook book for work.

This is very weird, but according to his estimation, the workload should never exhaust the resources on the island.

He then visited every corner of the island. He found out that many workers, after finishing their work, did not return the notebooks and leave the island. Therefore, the number of notebooks in idleness incerases as time passes by.

:::

To solve this problem, the governer change the rules of planning so that workers always return the notebooks and leave the island once their work finishes.

::: tip Rules of planning version 5

1. Every worker is assigned and owns a notebook.
1. Every worker can modify the texts on their own notebook.
1. Every worker returns the notebook when he leaves the island.
1. A worker can read another notebook if he knows the owner of that notebook.
1. A worker can write on another notebook if he knows the owner of that notebook and has a special permission.
1. A worker should not leave the island if other workers are planned to read or write on his notebook in future.
1. (new) A worker should leave the island when his work is done and when nobody will read or write on his notebook anymore.

:::

The governer then, according to the new rules, examineed his plan again. All workers are planned to leave the island as soon as possible.

He restarted the project. This time, everything works well. After 12 months, the enclopedia is finished!

## From social model to Mojo's ownership

Then we can come back to Mojo and see how the social model applies in Mojo. You can do the following mapping of the terminnologies:

- Worker: a variable (name).
- Notebook: a block of space on memory, a value.
- Location of notebook: The address of the corresponding meomeory (byte).
- Read notebook: Read the data at the address.
- Write notebook: Change the data at the address.
- Leave the island: Lifetime ends. Be destroyed.
- Assign notebook: Allocate memory.
- Return notebook: Free memory. The value is destroyed.

Then, the rule of planning can be translated into the langauge ownership model in safe Mojo as follows:

::: tip Rules of ownership

1. Every variable is the owner of a value.
1. Every variable can modify their own value.
1. The value is destroyed if its owner is destroyed.
1. A variable can read another value via the owner of that value.
1. A variable can modify another value via the owner of that value under special permission.
1. The life time of a variable should not end if other variable will read or write on his value.
1. The variable will be destroyed when it is not used anymore and no other variable will read or write its value.

:::

These rules of ownership are checked at compile time, and ensure that Mojo is safe at execution.

## ASAP Destruction Policy

Compared to Rust, Mojo is more aggressive in destroying variables. Rust variables end their lifetime at the end of a code block, but Mojo destroys a variable immediately after its last use ([ASAP destruction](https://docs.modular.com/mojo/manual/lifecycle/death)).

::: warning
The immediate destruction rule brings a problem: for example, `B` is an unsafe pointer to data in the structure `A`, but the Mojo compiler cannot infer this. `A` is destroyed immediately after its last use, resulting in `B` being a dangling pointer pointing to already freed memory.

```mojo
fn main():
    ...
    var A = SomeType()
    var B = UnsafePointer(A.buffer)  # A's last appearance, immediately destroyed
    
    print(B)  # B points to already freed memory

Currently, the recommended approach in Mojo is to use A once more to forcibly extend its lifetime:

```mojo
# Pseudo code
fn main():
    ...
    var A = SomeType()
    var B = UnsafePointer(A.buffer)  # A is not used for the last time, will not be destroyed
    
    print(B)  # B points to A's data, no problem
    _ = A^  # A appears here, manually extending its lifetime to this point
```

:::
