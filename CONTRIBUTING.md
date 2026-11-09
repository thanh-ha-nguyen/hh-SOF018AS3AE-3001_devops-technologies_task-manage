# Contributing

Use the shared GitHub workflow described in the DevOps course:

1. Fork the repository if you do not have write access.
2. Create a focused branch from `main`, such as `feat/add-task-filter`.
3. Make and test the change locally. Do not commit `.env` files, credentials, or generated output.
4. Open a pull request targeting `main`. Link the related issue or task, summarize the change, and include the tests you ran.
5. Request a review. Address feedback and wait for the required CI and security checks to pass before merging.

Release deployments are triggered only by annotated `vMAJOR.MINOR.PATCH` tags on `main`; see the release instructions in [README.md](./README.md).
