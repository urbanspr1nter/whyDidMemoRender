# whyDidMemoRender

Find out why your memoized component rendered. 

This is a **debugging**, or **diagnostic** tool for your development process. It is not intended to be used in Production level code. 

## Why?

`React.memo` is a nice way to optimize component rendering. A component wrapped with `React.memo` will only render again if the `props` have changed.

However, sometimes a component will render again without developer knowledge. Sometimes it can be an inadvertent `props` change. It can be hard to figure out which exact `props` changed. That is why `whyDidMemoRender` exists.

## How to use?

There are two ways. Through a `memoProxy`, or `whyDidMemoRender` call. You can view the logs/report by opening up the Dev console.

### memoProxy

Use this as the comparison function in place of `React.memo`'s default. 

```
React.memo(() => {
    // component
}, memoProxy);
```

### whyDidMemoRender

For finer control `whyDidMemoRender` can be called directly with the options set up:

* `tag` - The tag to pass for logs
* `displayName` - The custom component name
* `prevProps` - Previous props
* `nextProps` - Next props

```
React.memo(() => {
    // component
}, (prevProps, nextProps) => {
    whyDidMemoRender("MyTag", "ComponentName", prevProps, nextProps);

    return prevProps === nextProps;
});
```

### Results

Once your scenario has complete, you can view the results in the log. What is important is that the report will detail all props that may have affected render, and the reason why it rendered. Additionally, you can see the diff between objects in stringified form. Stringified because you can then copy and paste to a diffing tool and compare what changed for complex objects.

# FAQ

1. Will **whyDidMemoRender** help me solve all my rendering issues?

No, the intention for this tool is to help give hints as to why a memo component may be rendering. It may not be exact, but 
can lead to the right path on how to debug render issues.

2. Is it only limited to memo components?

Right now, yes. But you can also acquire additional information by wrapping `React.memo` in a current component and then using `memoProxy` to see what is causing a rerender on a component that isn't already memo. This will give hints as to what `props` are triggering renders.

3. What does it mean when I get the message `Could not stringify...` in the diff report?

It means the object was too complex. The internal diff tool currently only does a single level comparison.

4. Is **whyDidMemorender** always right? 

No. This goes back to the 1st point. This tool only gives hints. In order to fully utilize the tool, use it in combination of other render debugging tools like `react-devtools` at your disposal. Most importantly, understand how React renders components. 

I believe with this combination, this tool will be more useful.

## Why Did I Render

This tool was inspired by https://github.com/welldone-software/why-did-you-render "why did you render". This one actually directly listens to all React renders and tries its best to give you more than what this tool does. Go check it out!