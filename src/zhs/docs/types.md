# 类型

Python 是动态强类型语言, Python 的类型标注 (type hint) 只是为了方便 IDE 进行静态检查, 利于阅读, 而不是强制的, 对性能没有任何影响^[Cython, mypyc 等使渐进类型的编译器可能会使用类型标注进行部分优化.].

相比之下, Mojo 是静态编译的. 因此, 每个变量都必须在初始化前声明其值类型, 以便在内存中分配合适的空间. 在 Mojo 中, 类型标注则是必须的^[有时,编译器可以根据等号右值的类型对等号左值的类型进行推断. 在 Rust 中, IDE 甚至会直接将推断后的类型显示在代码中, 供用户检查. Mojo 尚无此功能. 为防止歧异, 还是推荐用户无论何时都进行类型标注.].

```mojo
fn main():
    var a: Float64 = 120.0
    var b: Int = 24
    var c: String = "Hello, world!"
    print(a, b, c)
```

```console
120.0 24 Hello, world!
```
