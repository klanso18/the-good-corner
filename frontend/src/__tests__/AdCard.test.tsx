import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AdCard from "../components/AdCard";

describe("AdCard component", () => {
  it("renders the AdCard component", () => {
    const view = render(
      <AdCard
        ad={{
          id: 1,
          title: "hello",
          price: 10,
          picture:
            "https://m.media-amazon.com/images/I/51TJ3ERPBwL._AC_UF1000,1000_QL80_.jpg",
        }}
        link="/"
      />
    );
    const title = screen.getByText("hello");
    expect(title).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(view.baseElement).toMatchSnapshot();
  });
});
