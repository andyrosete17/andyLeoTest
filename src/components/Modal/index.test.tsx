import { render, screen } from "@testing-library/react"
import { Modal } from "."
import userEvent from '@testing-library/user-event';

const closeModalHandler = jest.fn();
const renderComponent = () => {
    render(<Modal closeModal={closeModalHandler}>
        <span>test</span>
    </Modal>)
}

describe('Modal component', () => {

    it('should display the modal', () => {
        renderComponent();

        expect(screen.getByRole('dialog')).toBeTruthy();
    })

    it('should close the modal when clicking outside the screen', async () => {
        renderComponent();

        const modal = screen.getByRole('dialog');

        await userEvent.click(modal);

        expect(closeModalHandler).toBeCalled();
    })

    it('should close the modal when clicking in close button', async () => {
        renderComponent();

        const closeButton = screen.getByTestId('close-icon');

        await userEvent.click(closeButton);

        expect(closeModalHandler).toBeCalled();
    })

    it('should close the modal when pressing escape key', async () => {
        renderComponent();

        await userEvent.keyboard('{Escape}')

        expect(closeModalHandler).toBeCalled();
    })
})

