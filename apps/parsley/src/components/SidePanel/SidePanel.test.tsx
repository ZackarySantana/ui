import { MockedProvider } from "@apollo/client/testing";
import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import SidePanel from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider>
    <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
  </MockedProvider>
);

describe("sidePanel", () => {
  beforeEach(() => {
    // Setting the cookie to false means the drawer will be open by default, which means we
    // won't have to toggle it to test its contents.
    mockedGet.mockImplementation(() => "false");
  });

  it("should be uncollapsed if the user has never seen the filters drawer before", () => {
    render(<SidePanel {...props} />, { wrapper });
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");
  });

  it("should be collapsed if the user has seen the filters drawer before", () => {
    mockedGet.mockImplementation(() => "true");
    render(<SidePanel {...props} />, { wrapper });
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "false");
  });

  it("should be possible to toggle the drawer open and closed", async () => {
    const user = userEvent.setup();
    render(<SidePanel {...props} />, { wrapper });
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");
    await user.click(collapseButton);
    expect(collapseButton).toHaveAttribute("aria-expanded", "false");
  });
});

const props = {
  clearExpandedLines: vi.fn(),
  collapseLines: vi.fn(),
  expandedLines: [],
};
