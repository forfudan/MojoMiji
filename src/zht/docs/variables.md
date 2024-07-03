# 變量

在 Python 中, 變量 (variable) 可以看作一個標籤, 指向一個對象 (object). 比如, 以下代碼中, `a` 這個變量指向一個值爲 `1` 的整數對象. 你可以通過賦值語句, 將 `a` 這個變量重新關聯到 `"Hello world"` 這個字符串對象.

```python
a = 1
a = "Hello world!"
```

在 Mojo 中, 變量可以抽象地看作一個容器, 它擁有一個**變量名**和一個**值 (value)**. 語義上講, **變量名**即**值**的標識符 (identifier),同**值**相綁定. 從内存角度説, 變量擁有一段内存空間, 且擁有一個地址, 數據以比特的形式儲存在這段空間中.

## 聲明

在 Python 中,變量的初始化是非常簡單的.不僅不需要聲明,且變量類型也並非必要：

```python
a = 1
b: int = 1  # 使用類型提示
# 也可以這樣做,但不是必須
c: int
c = 2
```

相比之下,Mojo 的變量必須使用 var 關鍵詞來進行聲明(或稱定義),且大部分情況下必須标注變量類型.比如：

```mojo
fn main():
    var a: Int
```

以上代碼^[請注意, Mojo 的代碼須放在 `main()` 函数中,除了某些特殊情況.這裏統一放在`main()` 函数中.],首先聲明了一個名稱爲 `a` 的變量.即在内存上分配一段空間,其大小剛好可以儲存一個整數類型的值.

## 初始化

一旦變量聲明完畢後,就可以使用賦值語句對它進行初始化. Mojo 的賦值語句同 Python 相似,都使用等號`=`將右側的值賦給左側變量名.比如以下例中,就將 `1` 賦值給了 `a`.從内存的角度講,`1` 這個數字被存入了剛剛分配的内存空間中.從值的角度説,`1` 被綁定到了 `a` 這個變量名上.

```mojo
fn main():
    var a: Int
    a = 1
```

變量的聲明和賦值可以是分開進行,也可以同時進行.以下代碼和以下代碼等價.

```mojo
fn main():
    var a: Int = 1
```

## 改變值

一旦變量被賦值,我們可以繼續通過賦值語句改變變量的值：

```mojo
fn main():
    var a: Int = 1
    a = 10
```

注意,以下代碼是錯誤的.因爲 `a` 的類型是 `Int`,不能將字符串賦值給它.

```mojo
fn main():
    var a: Int = 1
    a = "Hello!"
```

## 變量重載

在 Python 中,變量是可以重載,且改變類型的.因爲 Python 的變量只是一個標籤,可以隨時指向其他的對象.以下代碼是合法的^[mypy 並不推薦這樣做].

```python
# python
a: int = 1
a: str = "Hello!"
```

在 Rust 中,變量也是可以重載的,只要使用 `let` 再次聲明.以下代碼是合法的：

```rust
fn main() {
    let a: i8 = 1
    let a: String = "Hello!".to_string()
}
```

在 Mojo 中,變量重載不被允許.以下代碼會報錯：

```mojo
fn main():
    var a: Int = 1
    var a: String = "Hello!"
```

```console
error: invalid redefinition of 'a'
    var a: String = "Hello!"
```

## 變量間傳遞值

同 Python 一樣,我們也可以在變量間傳遞值：

```mojo
fn main():
    var a: Int = 1
    var b = a
    print(a)
    print(b)
```

以上代碼,首先將 1 賦值給 `a`,然後將 `a` 的值賦予 `b`.結果如下:

```console
1
1
```

再比如,首先將 `"Hello"` 字符串 賦值給 `a`,然後將 `a` 的值賦予 `b`.結果如下:

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

注意,這和 Rust 不同.見下例:

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

編譯時報錯.原因是,在 Rust 中,對於堆上的數據結構,賦值默認進行所有權轉移.也就是標識符 `a` 將其對於字符串值的所有權,轉交給了標識符 `b`.`a`於是不能被使用.

而在 mojo 中,賦值時默認進行拷貝.也就是説,`a` 的值先被拷貝了一份,然後`b`獲得了這份拷貝值的所有權.`a`對於原始值的所有權没有喪失,還可以繼續使用.

如果要在 Mojo 中強制轉移所有權,則可以使用轉移符號(transfer operator):`^`. 代碼如下:

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

這裏,我們通過轉移符號,告知編譯器,將 `a` 對於字符串值的所有權轉移給 `b`.此後,`a`便回到未初始化狀態, 無法使用.

::: info
相比 Rust, Mojo 這樣處理的好處是減少編程時的心智負擔, 尤其在傳參時不用過分考慮函數是否獲取所有權導致原變量名失效. 缺點是默認拷貝的行爲(`__copyinit__`)會導致對於内存的額外消耗. 這一點, 編譯器會進行一些優化,比如賦值後, 原變量名不再使用, 會自動改用`__moveinit__`轉移所有權.

當然, 某些較小的, 棧上的數據類型在 Mojo 中永遠都是拷貝賦值, 包括 SIMD 類型. 這也使得 Mojo 在計算時的速度有時快於 Rust (傳址消耗大於直接讀取, 詳見此文:[Should Small Rust Structs be Passed by-copy or by-borrow?](https://www.forrestthewoods.com/blog/should-small-rust-structs-be-passed-by-copy-or-by-borrow/)).

關於所有權的問題, 這裏不多做介紹, 後面的教程會進行進一步講解.
:::
