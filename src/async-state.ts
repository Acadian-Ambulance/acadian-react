import React = require("react");

export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

export interface Request<a> { status: typeof REQUEST, payload: a }
export interface Success<a> { status: typeof SUCCESS, payload: a }
export interface Failure { status: typeof FAILURE, message: string }

export function request<a>(param: a): Request<a> { return { status: REQUEST, payload: param }; }
export function success<a>(result: a): Success<a> { return { status: SUCCESS, payload: result }; }
export function failure(message: string): Failure { return { status: FAILURE, message }; }

/** Represents the state of an asynchronous data request. */
export type AsyncState<Param, Result> = Request<Param> | Success<Result> | Failure

export function mapSuccess<P, R, MappedR>(state: AsyncState<P, R>, f: (result: R) => MappedR) {
  return state.status === SUCCESS ? success(f(state.payload)) : state;
}

/**
 * Returns the state of an async request. When `params` is non-null, state starts out as Request and `fetch` is called.
 * When the fetch returns, the state is updated to either Success or Failure using React.useEffect.
 * The fetch is called again when any of the values in the `deps` list change, so it should be a list of primitive
 * values that make up your params instance.
 */
// TODO: try to automatically extract deps from params
export function useAsyncState<Param, Result>(params: Param | null, deps: any[], fetch: (p: Param) => Promise<Result>) {
  const init = params === null ? null : request(params);
  const [state, setState] = React.useState<AsyncState<Param, Result> | null>(init);
  React.useEffect(() => {
    setState(init);
    if (params !== null) {
      fetch(params)
        .then(payload => success(payload))
        .catch(e => failure(e.message))
        .then(setState);
    }
  }, deps);
  return state;
}
