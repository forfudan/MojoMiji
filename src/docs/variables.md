# 变量

在 Python 中, 变量 (variable) 可以看作一个标签, 指向一个对象 (object). 比如, 以下代码中, `a` 这个变量指向一个值为 `1` 的整数对象. 你可以通过赋值语句, 将 `a` 这个变量重新关联到 `"Hello world"` 这个字符串对象.

```python
a = 1
a = "Hello world!"
```

在 Mojo 中, 变量可以抽象地看作一个容器, 它拥有一个**变量名**和一个**值 (value)**. 语义上讲, **变量名**即**值**的标识符 (identifier),同**值**相绑定. 从内存角度说, 变量拥有一段内存空间, 且拥有一个地址, 数据以比特的形式储存在这段空间中.

## 声明

在 Python 中,变量的初始化是非常简单的.不仅不需要声明,且变量类型也并非必要：

```python
a = 1
b: int = 1  # 使用类型提示
# 也可以这样做,但不是必须
c: int
c = 2
```

相比之下,Mojo 的变量必须使用 var 关键词来进行声明(或称定义),且大部分情况下必须标注变量类型.比如：

```mojo
fn main():
    var a: Int
```

以上代码^[请注意, Mojo 的代码须放在 `main()` 函数中,除了某些特殊情况.这里统一放在`main()` 函数中.],首先声明了一个名称为 `a` 的变量.即在内存上分配一段空间,其大小刚好可以储存一个整数类型的值.

## 初始化

一旦变量声明完毕后,就可以使用赋值语句对它进行初始化. Mojo 的赋值语句同 Python 相似,都使用等号`=`将右侧的值赋给左侧变量名.比如以下例中,就将 `1` 赋值给了 `a`.从内存的角度讲,`1` 这个数字被存入了刚刚分配的内存空间中.从值的角度说,`1` 被绑定到了 `a` 这个变量名上.

```mojo
fn main():
    var a: Int
    a = 1
```

变量的声明和赋值可以是分开进行,也可以同时进行.以下代码和以下代码等价.

```mojo
fn main():
    var a: Int = 1
```

## 改变值

一旦变量被赋值,我们可以继续通过赋值语句改变变量的值：

```mojo
fn main():
    var a: Int = 1
    a = 10
```

注意,以下代码是错误的.因为 `a` 的类型是 `Int`,不能将字符串赋值给它.

```mojo
fn main():
    var a: Int = 1
    a = "Hello!"
```

## 变量重载

在 Python 中,变量是可以重载,且改变类型的.因为 Python 的变量只是一个标签,可以随时指向其他的对象.以下代码是合法的^[mypy 并不推荐这样做].

```python
# python
a: int = 1
a: str = "Hello!"
```

在 Rust 中,变量也是可以重载的,只要使用 `let` 再次声明.以下代码是合法的：

```rust
fn main() {
    let a: i8 = 1
    let a: String = "Hello!".to_string()
}
```

在 Mojo 中,变量重载不被允许.以下代码会报错：

```mojo
fn main():
    var a: Int = 1
    var a: String = "Hello!"
```

```console
error: invalid redefinition of 'a'
    var a: String = "Hello!"
```

## 变量间传递值

同 Python 一样,我们也可以在变量间传递值：

```mojo
fn main():
    var a: Int = 1
    var b = a
    print(a)
    print(b)
```

以上代码,首先将 1 赋值给 `a`,然后将 `a` 的值赋予 `b`.结果如下:

```console
1
1
```

再比如,首先将 `"Hello"` 字符串 赋值给 `a`,然后将 `a` 的值赋予 `b`.结果如下:

```mojo
fn main():
    var a: String = "Hello"
    var b: String = a
    print(a)
    print(b)
```

```console
Hello
Hello
```

注意,这和 Rust 不同.见下例:

```rust
fn main() {
    let a = "Hello".to_string();
    let b = a;
    println!("{a}");
    println!("{b}");
}
```

```console
2 |     let a = "Hello".to_string();
  |         - move occurs because `a` has type `String`, which does not implement the `Copy` trait
3 |     let b = a;
  |             - value moved here
4 |     println!("{a}");
  |               ^^^ value borrowed here after move
```

编译时报错.原因是,在 Rust 中,对于堆上的数据结构,赋值默认进行所有权转移.也就是标识符 `a` 将其对于字符串值的所有权,转交给了标识符 `b`.`a`于是不能被使用.

而在 mojo 中,赋值时默认进行拷贝.也就是说,`a` 的值先被拷贝了一份,然后`b`获得了这份拷贝值的所有权.`a`对于原始值的所有权没有丧失,还可以继续使用.

如果要在 Mojo 中强制转移所有权,则可以使用转移符号(transfer operator):`^`. 代码如下:

```mojo
fn main():
    var a: String = "Hello"
    var b = a^
    print(a)
    print(b)
```

```console
error: use of uninitialized value 'a'
print(a)
```

这里,我们通过转移符号,告知编译器,将 `a` 对于字符串值的所有权转移给 `b`.此后,`a`便回到未初始化状态, 无法使用.

::: info
相比 Rust, Mojo 这样处理的好处是减少编程时的心智负担, 尤其在传参时不用过分考虑函数是否获取所有权导致原变量名失效. 缺点是默认拷贝的行为(`__copyinit__`)会导致对于内存的额外消耗. 这一点, 编译器会进行一些优化,比如赋值后, 原变量名不再使用, 会自动改用`__moveinit__`转移所有权.

当然, 某些较小的, 栈上的数据类型在 Mojo 中永远都是拷贝赋值, 包括 SIMD 类型. 这也使得 Mojo 在计算时的速度有时快于 Rust (传址消耗大于直接读取, 详见此文:[Should Small Rust Structs be Passed by-copy or by-borrow?](https://www.forrestthewoods.com/blog/should-small-rust-structs-be-passed-by-copy-or-by-borrow/)).

关于所有权的问题, 这里不多做介绍, 后面的教程会进行进一步讲解.
:::
