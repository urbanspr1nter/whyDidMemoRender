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
