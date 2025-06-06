# Information, tips, and warnings

This chapter summarizes the information, tips, and warnings that are scattered throughout the Miji. It is intended to help you quickly find the information you need without having to search through the entire Miji.

[Speed comparison with C and Rust](../move/examples.md): Do you know that Mojo is faster than C and Rust in some cases?

[Why you should always use `var` to define variables](../basic/variables.md): It is good to cultivate a habit of using `var` to define variables. Otherwise, it may lead to confusion and unintended behavior, especially when you are working with nested scopes.

[Chained comparison: Syntax sugar or poison?](../basic/operators.md): Are you aware that chained comparison can lead to confusion and unintended behavior?

[Syntax shapes your behavior - Rust vs Mojo in transfer of ownership](../advanced/ownership.md): Are you aware that your coding style is influenced by the syntax of the programming language you use?

[You can be still safe without knowing the ownership model](../advanced/ownership.md): Do you know that you can still be safe without understanding the ownership model? But this does not apply if you begin to dive into the ocean of unsafe Mojo.

[Arguments and reference - Mojo vs Rust](../basic/functions.md): Do you know that the term "reference" means different things in Mojo and Rust?

[ASAP Destruction Policy](../advanced/ownership.md): Do you know that Mojo compiler has a policy that destroys a variable as soon as they are used for the last time? However, any safe pointers to the variable can extend the lifetime of the variable to as long as the pointer is alive.

[Inconsistent behaviors of copy and move](../advanced/ownership.md): If you define different behaviors for `__copyinit__()` and `__moveinit__` in a struct, you may encounter unexpected behaviors when you use the assignment operator `=`. This is because the Mojo compiler will call the `__moveinit__()` method if the variable is not used after the assignment. So, you should always define the same behavior for both methods.
