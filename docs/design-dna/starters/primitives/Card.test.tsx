import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders without crashing', () => {
    const { container } = render(<Card>content</Card>);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders children', () => {
    render(<Card>Hello Card</Card>);
    expect(screen.getByText('Hello Card')).toBeInTheDocument();
  });

  it('renders as a div by default', () => {
    const { container } = render(<Card>content</Card>);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it("renders as article when as='article'", () => {
    const { container } = render(<Card as="article">article content</Card>);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it("renders as anchor when as='a' with href", () => {
    const { container } = render(
      <Card as="a" href="/example">
        link content
      </Card>,
    );
    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', '/example');
  });

  it('adds role=button and tabIndex when onClick is provided', () => {
    const { container } = render(<Card onClick={() => {}}>clickable</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabindex', '0');
  });
});

describe('Card.Body', () => {
  it('renders children', () => {
    render(<Card.Body>Body content</Card.Body>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card.Body className="custom-class">Body</Card.Body>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('Card.Footer', () => {
  it('renders children', () => {
    render(<Card.Footer>Footer content</Card.Footer>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card.Footer className="footer-class">Footer</Card.Footer>);
    expect(container.firstChild).toHaveClass('footer-class');
  });
});

describe('Card.Thumbnail', () => {
  it('renders children', () => {
    render(<Card.Thumbnail>Thumbnail content</Card.Thumbnail>);
    expect(screen.getByText('Thumbnail content')).toBeInTheDocument();
  });

  it('renders the gradient overlay with aria-hidden', () => {
    const { container } = render(<Card.Thumbnail>img</Card.Thumbnail>);
    const overlay = container.querySelector("[aria-hidden='true']");
    expect(overlay).toBeInTheDocument();
  });
});

describe('Card composition', () => {
  it('renders all sub-components together', () => {
    render(
      <Card>
        <Card.Thumbnail>thumb</Card.Thumbnail>
        <Card.Body>body text</Card.Body>
        <Card.Footer>footer text</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('thumb')).toBeInTheDocument();
    expect(screen.getByText('body text')).toBeInTheDocument();
    expect(screen.getByText('footer text')).toBeInTheDocument();
  });
});
