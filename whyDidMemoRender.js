import { isEqual, isNil } from "lodash";

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
 export default function whyDidMemoRender(tag, displayName, prevProps, nextProps, comparer) {
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

    for(const k of unionKeys) {
        const isDeepEqual = isEqual(prevProps[k], nextProps[k]);
        if (prevProps[k] !== nextProps[k] || !isDeepEqual) {
            const diff = diffProps(prevProps[k], nextProps[k]);
            results[k] = {
                prev: prevProps[k],
                next: nextProps[k],
                reason: findReasonWhyRenderForProp(prevProps[k], nextProps[k], isDeepEqual),
                diff
            }
        }
    }

    console.log("%cWHY RESULTS", "font-size: medium; font-weight: bold;");
    console.log(tag, displayName, "Props are prev, next", prevProps, nextProps);
    if (Object.keys(results).length > 0) {
        console.log(`%c ${tag} 🔥🔄🔥 WILL RENDER`, "font-weight: bold");
        console.log(`${tag} ${displayName} RESULTS:`, results);
    } else {
        console.log(`%c ${tag} 🛑⏹️🛑 WONT RENDER`, "font-weight: bold");
        console.log(`${tag} ${displayName} RESULTS`, results);
    }
    return {
        compareResult: comparer ? comparer(prevProps, nextProps) : prevProps === nextProps,
        report: results
    };
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

// First Level diffing
function diffProps(o1, o2) {
    const results = {};

    if (isNil(o1) && isNil(o2)) {
        return results;
    }

    results["why_warnings"] = [];
    results["why_functions"] = [];
    results["why_primitives"] = [];
    results["why_errors"] = [];

    if (isNil(o1) || isNil(o2)) {
        if ((isNil(o1) && o2 && typeof o2 === "object")
                || (isNil(o2) && o1 && typeof o1 === "object")) {
            results["why_warnings"].push({
                message: "one of the objects is null, or undefined",
                prevStr: o1,
                nextStr: o2
            });
        } else if(isNil(o1) && o2 && typeof o2 === "function") {
            results["why_warnings"].push({
                message: "one of the objects is null, or undefined",
                prevStr: o1,
                nextStr: o2.toString()
            });
        } else if(isNil(o2) && o1 && typeof o1 === "function") {
            results["why_warnings"].push({
                message: "one of the functions is null, or undefined",
                prevStr: o1.toString(),
                nextStr: o2
            });
        } else {
            results["why_warnings"].push({
                message: "one of the props is null, or undefined",
                prevStr: o1 ? JSON.stringify(o1) : o1,
                nextStr: o2 ? JSON.stringify(o2) : o2
            });
        }
    }
    else if (typeof o1 === "object" && typeof o2 === "object") {
        const o2Keys = Object.keys(o2);

        for(const k of o2Keys) {
            if (!_.isEqual(o1[k], o2[k])) {
                try {
                    results[k] = {
                        prevStr: JSON.stringify(o1[k]),
                        nextStr: JSON.stringify(o2[k])
                    };
                } catch(error) {
                    results["why_warnings"].push({
                        err: "Could not stringify. Objects used instead for user handling of comparison",
                        k,
                        prevStr: o1[k],
                        nextStr: o2[k]
                    });
                }
            }
        }
    } else if(typeof o1 === "function" && typeof o2 === "function") {
        results["why_functions"].push({
            prevStr: o1.toString(),
            nextStr: o2.toString()
        });
    } else if(typeof o1 === typeof o2) {
        results["why_primitives"].push({
            prevStr: JSON.stringify(o1),
            nextStr: JSON.stringify(o2)
        });
    } else {
        results["why_errors"].push({
            err: "Objects are of different type. Did not convert to string.",
            prevStr: o1,
            nextStr: o2
        });
    }

    return results;
}
