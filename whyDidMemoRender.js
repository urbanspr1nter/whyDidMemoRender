/**
 * whyDidMemoRender
 * 
 * Helps determine which prop is actually invoking a render for a React memoized
 * component. Various render tools exist to actually detect rerender, but sometimes
 * it is hard to actually narrow down as to exactly which prop is causing this.
 * 
 * This handy little function will iterate through each prop in the component's
 * props object and does a default shallow comparison to give a little bit more
 * context.
 * @param {*} tag name to prefix log statements.
 * @param {*} displayName name of the memoized component
 * @param {*} prevProps previous props that is used in render
 * @param {*} nextProps next props that will be used in render
 */
 export default function whyDidMemoRender(tag, displayName, prevProps, nextProps) {
    const prevPropsKeys = Object.keys(prevProps);
    const nextPropsKeys = Object.keys(nextProps);

    const allKeys = [...prevPropsKeys, ...nextPropsKeys];
    const unionKeys = [];
    for(const k of allKeys) {
        if(unionKeys.indexOf(k) === -1) {
            unionKeys.push(k);
        }
    }

    const results = {};

    console.log(tag, displayName, "---- BEGIN RENDER ----");
    console.log(tag, displayName, "Props are prev, next", prevProps, nextProps);
    console.log(tag, displayName, "Are props equal?", prevProps === nextProps);
    for(const k of unionKeys) {
        console.log(tag, displayName, k, "exists in", "prevProps", !!prevProps[k], "nextProps", !!nextProps[k]);
        console.log(tag, displayName, k, "equal?", prevProps[k] === nextProps[k]);

        if (prevProps[k] !== nextProps[k]) {
            results[k] = {
                prev: prevProps[k],
                next: nextProps[k],
                debug: () => console.log(tag, displayName, "prop:", k, "difference", prevProps[k], nextProps[k])
            }
        }
    }
    console.log(tag, `*** Why did ${displayName} render? *** Results`, results);
    console.log(tag, displayName, "---- END RENDER ----");

    return results;
}

/**
 * Report differences from results
 * @param {*} results 
 */
export function diffReporter(results) {
    for (const k in results) {
        if (results[k]) {
            const result = results[k];

            result.debug();
        }
    }
}
