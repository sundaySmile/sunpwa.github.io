### 


- 使用 async / await 执行异步函数操作


Offscreen Images

为了优化最佳首屏访问体验，初次请求时只下载折叠层上的图片。使用的方式有：
- 关键路径渲染（critical Rendering Path)  
    > CSSOM 树和 DOM 树合并成渲染树，然后用于计算每个可见元素的布局，并输出给绘制流程，将像素渲染到屏幕上。优化上述每一个步骤对实现最佳渲染性能至关重要.  
    浏览器处理网页的步骤
    1、 处理 HTML 标记并构建 DOM 树。
    2、处理 CSS 标记并构建 CSSOM 树。
    3、 将 DOM 与 CSSOM 合并成一个渲染树。
    4、 根据渲染树来布局，以计算每个节点的几何信息。
    5、 将各个节点绘制到屏幕上  
    优化关键渲染路径_就是指最大限度缩短执行上述第 1 步至第 5 步耗费的总时间。 这样一来，就能尽快将内容渲染到屏幕上，此外还能缩短首次渲染后屏幕刷新的时间，即为交互式内容实现更高的刷新率。

    阻塞渲染的css  

    ```
    <link href="style.css" rel="stylesheet">
    <link href="print.css" rel="stylesheet" media="print">
    <link href="other.css" rel="stylesheet" media="(min-width: 40em)">

    ```

    对关键渲染路径的抽取：
        - 关键资源： 可能阻止网页首次渲染的资源 
        - 关键路径长度： 获取所有关键资源所需的往返次数
        - 关键字节： 实现网页首次渲染所需的总字节数

- IntersectionObserver
    > 
    ```
    // 创建一个IntersectionObserver
    var io = new IntersectionObserver(
        entries => {
            console.log(entries);
        },
        {
            /* Using default options. Details below */
            
            // Threshold(s) at which to trigger callback, specified as a ratio, or list of
            // ratios, of (visible area / total area) of the observed element (hence all
            // entries must be in the range [0, 1]).  Callback will be invoked when the visible
            // ratio of the observed element crosses a threshold in the list.
            threshold: [0],
        }
        );
        // Start observing an element
        io.observe(element);

        // Stop observing an element
        // io.unobserve(element);

        // Disable entire IntersectionObserver
        // io.disconnect();
    ```

- Optimize Images
    //

- 最小化css文件