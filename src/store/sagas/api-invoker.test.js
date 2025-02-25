import { DISPLAY_ERROR } from "../actions";
import apiInvoker from "./api-invoker";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import mockAxios from "axios";
import { sessionStorage } from "storage2";

jest.mock("axios");
jest.mock("storage2");

describe("api-invoker", () => {
  const reducer = (state = [], action) => {
    return [...state, action];
  };

  const fakeDataSetResponse = { name: "I am a fake response" };
  const errorAction = { type: "CUSTOM_ERROR_ACTION" };

  let store, sagaMiddleware, actionator;

  beforeEach(() => {
    window.API_HOST = "http://fake.com/";

    sagaMiddleware = createSagaMiddleware();
    store = createStore(reducer, applyMiddleware(sagaMiddleware));
    actionator = jest.fn().mockReturnValue({ type: "unused" });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("invokes axios with the correct object when no query parameter function is passed in", () => {
    mockAxios.get.mockImplementationOnce(() => ({
      status: 200,
      data: []
    }));
    sagaMiddleware.run(apiInvoker({ endpoint: "/gohome", actionator }));

    expect(mockAxios.get).toHaveBeenCalledWith("/gohome", {
      baseURL: window.API_HOST,
      params: {},
      paramsSerializer: expect.anything(),
      withCredentials: true
    });
  });

  it("passes query parameters when passed in", () => {
    const mockQueryParam = { some: "param" };
    const queryParameterBuilder = jest.fn().mockReturnValue(mockQueryParam);
    mockAxios.get.mockImplementationOnce(() => ({
      status: 200,
      data: []
    }));
    sagaMiddleware.run(
      apiInvoker({ endpoint: "my-url", actionator, queryParameterBuilder })
    );

    expect(mockAxios.get).toHaveBeenCalledWith("my-url", {
      baseURL: window.API_HOST,
      params: mockQueryParam,
      paramsSerializer: expect.anything(),
      withCredentials: true
    });
  });

  it("gets query parameters from the query param function", () => {
    const mockEvent = { type: "some type" };
    const queryParameterBuilder = jest.fn();
    mockAxios.get.mockImplementationOnce(() => ({
      status: 200,
      data: []
    }));
    sagaMiddleware.run(
      apiInvoker({ endpoint: "", actionator, queryParameterBuilder }),
      mockEvent
    );

    expect(queryParameterBuilder).toHaveBeenCalledWith(mockEvent);
  });

  it("calls actionator when successful", () => {
    mockAxios.get.mockImplementationOnce(() => ({
      status: 200,
      data: fakeDataSetResponse
    }));

    sagaMiddleware.run(apiInvoker({ endpoint: "", actionator }));

    expect(actionator).toHaveBeenCalledWith(fakeDataSetResponse);
  });

  it("dispatches a display error by default when the network fails with an error", () => {
    console.error = jest.fn();
    const expectedError = new Error("Network error");
    mockAxios.get.mockImplementationOnce(() => {
      throw expectedError;
    });

    sagaMiddleware.run(apiInvoker({ endpoint: "", actionator }));

    expect(console.error).toHaveBeenCalledWith(expectedError);
    expect(store.getState()).toContainEqual({
      type: DISPLAY_ERROR
    });
  });

  it("dispatches a display error by default if the status code is not 200", () => {
    mockAxios.get.mockImplementationOnce(() => ({
      status: 421,
      data: fakeDataSetResponse
    }));

    sagaMiddleware.run(apiInvoker({ endpoint: "", actionator }));

    expect(store.getState()).toContainEqual({
      type: DISPLAY_ERROR
    });
  });

  it("dispatches provided errorAction when the network fails with an error", () => {
    mockAxios.get.mockImplementationOnce(() => {
      throw new Error("Network error");
    });

    sagaMiddleware.run(apiInvoker({ endpoint: "", actionator, errorAction }));

    expect(store.getState()).toContainEqual(errorAction);
  });

  it("dispatches provided errorAction if the status code is not 200", () => {
    mockAxios.get.mockImplementationOnce(() => ({
      status: 421,
      data: fakeDataSetResponse
    }));

    sagaMiddleware.run(apiInvoker({ endpoint: "", actionator, errorAction }));

    expect(store.getState()).toContainEqual(errorAction);
  });
});
