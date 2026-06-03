# Roadmap of Miji

I want to provide a comprehensive guide for users to understand the features and capabilities of Miji. However, I should always be clear about the identity of Miji that it is for Pythonistas. Thus, I need to be very careful about the feature I try to discuss. Some features are nice, e.g., C interoperability, but they are not a topic that most Python users care familiar with. Even I want to discuss it, it should go to the end of the roadmap, go to the end of the book, and be clearly marked as niche content.

## To be considered for Miji

- [ ] Add some discussion on inplace operations of heap-allocated data structures. `a = a * a` might be dangerous as the identifier `a` is associated with both the operands and the result. Then the operand might be modified during the computation (if several loops are conducted on the elements of `a` in which in-place modifications occur). This should not happen but sompilers may do some optimizations that cause this.
