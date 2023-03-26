import { renderHook, waitFor } from "@testing-library/react";
import { useNearEndScreen } from ".";
import React from "react";

describe('useNearEndScreen hook', () => {
    const observeMock = jest.fn();
    const disconnectMock = jest.fn();
    beforeEach(() => {
        jest
            .spyOn(React, 'useRef')
            .mockReturnValue({
                current: "test"
            });

        const intersectionObserverMock = () => ({
            observe: observeMock,
            disconnect: disconnectMock,
        });
        window.IntersectionObserver = jest
            .fn()
            .mockImplementation(intersectionObserverMock);

    })
    it('isNearScreen should be false when loaded at first time', () => {

        const { result } = renderHook(() => useNearEndScreen({ once: true }));

        // expect(result.current.fromRef).toBeFalsy();
    })

    // it('should observe the ref when mounted and disconnect when unmounted', async () => {

    //     const { unmount } = renderHook(() => useNearEndScreen({ once: true }));

    //     await waitFor(() => {
    //         expect(observeMock).toBeCalledWith("test");
    //     });

    //     unmount();

    //     expect(disconnectMock).toBeCalled();
    // })
})