import { useRouteError } from "react-router-dom";
import { Container } from "react-bootstrap";
import * as styles from "./error-page.module.scss"

export default function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <Container id="error-page" fluid className={styles.errorContainer}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i className="text-black-50">{error.message || error.statusText}</i>
      </p>
    </Container>
  );
}