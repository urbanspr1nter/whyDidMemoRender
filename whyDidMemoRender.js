import { isEqual } from "lodash";

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
    for(const k of unionKeys) {
        const isDeepEqual = isEqual(prevProps[k], nextProps[k]);
        if (prevProps[k] !== nextProps[k] || !isDeepEqual) {
            results[k] = {
                prev: prevProps[k],
                next: nextProps[k],
                reason: findReasonWhyRenderForProp(prevProps[k], nextProps[k], isDeepEqual),
                debug: () => console.log(tag, displayName, "prop:", k, "difference", prevProps[k], nextProps[k])
            }
        }
    }
    if (Object.keys(results).length > 0) {
        console.log(tag, `*** Why did ${displayName} render? *** Results`, results);
    } else {
        console.log(tag, `*** ${displayName} WILL NOT render ***`, results);
    }

    console.log(tag, displayName, "---- END RENDER ----");

    return results;
}

/**
 * Finds reasons why the render might have occurred.
 * @param {*} obj1 
 * @param {*} obj2 
 * @param {*} isDeepEqual 
 * @returns 
 */
function findReasonWhyRenderForProp(obj1, obj2, isDeepEqual) {
    if (obj1 !== obj2 && !isDeepEqual) {
        return "Props have changed and are different objects.";
    }
    if (obj1 === obj2 && !isDeepEqual) {
        return "Props have changed.";
    }
    if (obj1 !== obj2 && isDeepEqual) {
        return "Props are same, but objects different."
    }
    if (obj1 !== obj2) {
        return "Objects are different.";
    }
}

/**
 * Used as an adapter to whyDidMemoRender for the React.memo comparer function
 * @param {*} prevProps 
 * @param {*} nextProps 
 * @returns 
 */
export const memoProxy = (prevProps, nextProps) => {
    whyDidMemoRender("WHY", "MemoComponent", prevProps, nextProps);

    return prevProps === nextProps;
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
