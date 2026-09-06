# Security model

The provided HTTP server listens on loopback, rejects hidden files and paths escaping the release directory, disables directory listings, and provides no write API. It is a local preview server, not an authenticated network service.

Project commands write local files selected by the operator. Treat imported geometry and replay data as untrusted until validated. Keep source files under the release root; do not serve private workspace directories.

The project validator checks paths, hashes, mesh indices, finite values, pose quaternions and revision cycles. Hashes establish byte identity, not trust in the author or physical validity of the data. The browser has no account, analytics or upload integration.

For a vulnerability report, include the release version and a minimal reproduction with synthetic inputs. Remove secrets, contact details and private session information before sharing the report. Use the repository's private vulnerability reporting channel if enabled by its maintainer.
