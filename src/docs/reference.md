# Reference

In Rust, "reference" is more like a safe pointer to the value. You need to de-reference it to assess the value, although sometimes the de-referencing is automatically done.

In Mojo, "reference" is not a type (a safe pointer) as is in Rust, but is more like the reference in C++. A reference refers to the same value but with a different name. In another word, it is an alias. It is therefore, sharing the same behaviors of the value it refers to. No de-referencing is needed to get access to the value. For example, if you pass `a: Int` into function `fn copyit(read some: Int)`, then `some` is an immutable reference (alias) of `a` and behave exactly as `a`. The code `b = some.copy()` within the function would call `a`'s `copy()` method.

If you want to use Rust's reference, e.g., `&`, in Mojo, you should use the type `Pointer`, which is a safe pointer that will not null or dangling. You need to deference it to get access the value. For example, a iterator over the `List` type would returns, in each step, a pointer to one of the elements of `List`. To print the value, you have to first dereference the pointer with `[]`.

```mojo
def main():
    for i in List[Int](1, 2, 3, 4):
        # i is of the type Pointer[Int]
        print(i[])  # [] is the de-referencing operator
```
