declare module "why-did-memo-render" {
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
    export function whyDidMemoRender(tag: string, displayName: string, prevProps: any, nextProps: any): any;

    /**
     * Used as an adapter to whyDidMemoRender for the React.memo comparer function
     * @param {*} prevProps 
     * @param {*} nextProps 
     * @returns 
     */
    export function memoProxy(prevProps: any, nextProps: any): boolean;

    /**
     * Report differences from results
     * @param {*} results 
     */
    export function diffReporter(results: any): void;
}
