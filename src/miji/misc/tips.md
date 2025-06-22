# Information, tips, and warnings

This chapter summarizes the information, tips, and warnings that are scattered throughout the Miji. It is intended to help you quickly find the information you need without having to search through the entire Miji.

[Speed comparison with C and Rust](../move/examples#fibonacci-sequence): Do you know that Mojo is faster than C and Rust in some cases? I am also surprised by the results of the speed comparison.

[Docstring style guide](../move/common#documentation-string): There are many styles of docstring in Python. Some people use Google style, some people use NumPy style, and some people use reStructuredText (reST) style. Do you know that Mojo has its own [docstring style guide](https://github.com/modular/modular/blob/main/mojo/stdlib/docs/docstring-style-guide.md)?

[Graph: Memory layout of a variable](../basic/variables): This graph illustrates how a variable of `Int` type is laid out in memory.

[Why you should always use `var` to define variables](../basic/variables.md): It is good to cultivate a habit of using `var` to define variables. Otherwise, it may lead to confusion and unintended behavior, especially when you are working with nested scopes.

[Type is important](../basic/variables.md#conceptual-model-of-variable): Type is important to a variable. It determines how the value is stored in memory, how much space it occupies, how it can be interpreted, and how it can be manipulated.

[Do not abuse function overloading](../basic/functions.md#function-overloading): Functional overloading is powerful, but it can lead to confusion if you use it as a general container for anything. You should always make the function names self-explanatory.

[Graph: `read` and `owned` arguments in memory](../basic/functions#mutability-of-arguments): These graphs illustrate how `read` and `owned` arguments are laid out in memory and how they are interacted with the variables you pass to the function.

[Arguments and reference - Mojo vs Rust](../basic/functions.md): Do you know that the term "reference" means different things in Mojo and Rust?

[Why we should use constructors explicitly](../basic/types#integer): Let's do an exercise to understand why we should always use constructors explicitly.

[R-value and L-value](../basic/types#literals-and-type-inference): Do you know that a value can be either an r-value or an l-value?

[Floating-point values are inexact](../basic/types#float): Are you aware that floating-point values are inexact and can lead to unexpected results? This is because floating-point values are represented in binary format, which cannot always be exactly represented in decimal format.

[Is character a grapheme cluster or a code point?](../basic/string#grapheme-clusters): Do you know that a "character" can mean different things? It can be a single byte, a code point, or a grapheme cluster. So you should be more explicit about what you mean by "character" in your code.

[Visual checks of valid UTF-8 code points](../basic/string#utf-8-encoding): Do you know that, in the first byte of a valid UTF-8 code point, the number of leading ones is equal to the number of bytes for non-single-byte code point.

[Chained comparison: Syntax sugar or poison?](../basic/operators.md): Are you aware that chained comparison can lead to confusion and unintended behavior?

[Non-exhaustive conditionals - Mojo vs Python](../basic/control#non-exhaustive-conditionals): Do you know that non-exhaustive conditionals would lead to compile-time errors in Mojo if you do not handle all possible cases for functions that return a value? This is different from Python, where non-exhaustive conditionals would not lead to errors.

[Graph: Memory layout of a struct](../basic/structs#memory-layout-of-struct): This graph illustrate how a struct is laid out in memory.

[Fetch value of a field in a struct](../basic/structs#memory-layout-of-struct): Are you curious about how Mojo fetches the value of a field in a struct, e.g., `human.age`? It calculates the offset of the field from the start of the struct in memory, and then reads the value with the address.

[Verify the memory layout of a struct](../basic/structs#memory-layout-of-struct): Do you know that you can verify the memory layout of a struct by using `bitcast()` method of `UnsafePointer`? But use it with caution.

[`Float64` or `SIMD[DType.float64, 1]`](../advanced/simd.md#type-of-simd): You can use either `Float64` or `SIMD[DType.float64, 1]` to represent a single-precision floating-point value, because the former one is just an alias of the latter. In most cases, using the former one is more concise and readable.

[`Int` and `Bool` are not SIMD types](../advanced/simd.md#type-of-simd): Do you know that the built-in type `Int` and `Bool` are not aliases of SIMD? The corresponding SIMD types are actually `SIMD[DType.index, 1]` or `SIMD[DType.bool, 1]`, respectively. So, don't be surprised if the compiler complains about the type mismatch when you try to use `Int` or `Bool` in a SIMD context.

[Implicit and explicit trait declaration](../advanced/generic#traits): Do you know that Mojo allows you to use traits either implicitly or explicitly? You do not need to put the name a trait in the struct declaration. As long as you define all the methods that the trait requires, the compiler will automatically treat the struct as conforming to the trait. It is useful when you want to apply some self-defined traits on a built-in type.

[Use multiple traits in functions](../advanced/generic#multiple-traits): At the moment, Mojo does not support using multiple traits for a type parameter in functions.

[Syntax shapes your behavior - Rust vs Mojo in transfer of ownership](../advanced/ownership.md): Are you aware that your coding style is influenced by the syntax of the programming language you use?

[You can be still safe without knowing the ownership model](../advanced/ownership.md): Do you know that you can still be safe without understanding the ownership model? But this does not apply if you begin to dive into the ocean of unsafe Mojo.

[Non-transferable values](../advanced/ownership.md): Do you know that some values cannot be transferred to another owner? This is because they are small enough to be copied efficiently. If you use `^` to transfer ownership of such values, the compiler will ignore this and treat them as if they were copied.

[ASAP Destruction Policy](../advanced/ownership.md): Do you know that Mojo compiler has a policy that destroys a variable as soon as they are used for the last time? However, any safe pointers to the variable can extend the lifetime of the variable to as long as the pointer is alive.

[Inconsistent behaviors of copy and move](../advanced/ownership.md): If you define different behaviors for `__copyinit__()` and `__moveinit__` in a struct, you may encounter unexpected behaviors when you use the assignment operator `=`. This is because the Mojo compiler will call the `__moveinit__()` method if the variable is not used after the assignment. So, you should always define the same behavior for both methods.

[Historical keywords of references conventions](../advanced/references#keywords-of-conventions): Do you know that the keywords `read`, `mut`, and `owned` were not always the keywords used to define the ownership and mutability of function arguments? You can find the historical keywords and the versions of Mojo when they were introduced and deprecated.
