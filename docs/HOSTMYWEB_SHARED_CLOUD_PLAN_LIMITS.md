# HostMyWeb Shared Cloud Package Limits

Effective design target: August 22, 2026

This file is the operating reference for the public HostMyWeb shared-cloud plans. The public website and the 20i Hosting Package Types should stay aligned with these values.

## Public plan allocations

| Plan | Price | Websites | SSD webspace | Bandwidth | Included mailboxes | MySQL databases | SSH | Git |
| --- | ---: | ---: | ---: | --- | ---: | ---: | --- | --- |
| Starter | $7.99/mo | 1 | 10 GB | Unlimited | 5 × 10 GB | 5 | Available | Available |
| Business | $12.99/mo | Up to 5 | 25 GB | Unlimited | 25 × 10 GB | 25 | Available | Available |
| Pro | $21.99/mo | Up to 15 | 50 GB | Unlimited | 50 × 10 GB | 50 | Available | Available |
| Agency | $39.99/mo | Up to 30 | 100 GB | Unlimited | 100 × 10 GB | 100 | Available | Available |

Each MySQL database on the current hosting platform is limited to 1 GB. Standard mailboxes use 10 GB each on the separate email platform.

## Shared-cloud resource model

HostMyWeb shared hosting is not sold as a fixed VPS-style CPU/RAM allocation. The upstream platform is autoscaling and load-balanced and does not use traditional per-account LVE caps. Public copy should therefore disclose the limits HostMyWeb actually controls—webspace, websites, mailboxes, database count, and feature access—rather than inventing RAM or CPU numbers.

“No fixed LVE limits” must never be represented as infinite compute. Workloads that require dedicated CPU/RAM, custom server software, large individual databases, or operating-system control belong on Managed Cloud or VPS.

## Migration policy

Standard supported automated website migration is included with HostMyWeb hosting. Supported automated sources include cPanel, Plesk, DirectAdmin, Fasthosts, Heart Internet, and WordPress migrations using FTP credentials. The automated platform can move website files, MySQL databases, and eligible mailboxes depending on migration source.

Complex/manual migration begins at $49. Use the paid manual service for unsupported source environments, unusual configurations, manual reconstruction, complicated DNS transitions, coordinated multi-site moves, or other work that falls outside the automated migration path.

Domain-name registration and transfer are separate from website migration. WordPress migrations that use FTP credentials alone may not include mailbox migration.

## Developer tools

SSH and Git are part of the shared-cloud product family and are not intentionally reserved for Pro or Agency. Enable the corresponding 20i package features for Starter, Business, Pro, and Agency package types before treating this as a production entitlement.

## Upstream reseller capacity

The current Reseller 25 tier has a 30 GB total SSD allowance and 50 included mailboxes, so the public HostMyWeb allocations above are designed with the expectation that the upstream reseller account is upgraded as customer adoption grows. Reseller 50 and higher currently provide unlimited SSD storage at the reseller-account level, with the hosting-account count determined by the selected reseller tier.

Operational rule: monitor total provisioned hosting accounts and real storage/mailbox consumption, and upgrade the upstream reseller tier before HostMyWeb reaches a provider-level limit. Do not reduce an existing customer's published plan entitlement because the reseller account is approaching a tier limit.

## Provisioning checklist

Before broad paid launch, create or verify four matching 20i Hosting Package Types and make the public entitlement match the provider configuration:

- Starter — 10 GB webspace, 1 site target, 5 mailboxes, 5 MySQL databases, SSH and Git enabled.
- Business — 25 GB webspace, up to 5 sites, 25 mailboxes, 25 MySQL databases, SSH and Git enabled.
- Pro — 50 GB webspace, up to 15 sites, 50 mailboxes, 50 MySQL databases, SSH and Git enabled.
- Agency — 100 GB webspace, up to 30 sites, 100 mailboxes, 100 MySQL databases, SSH and Git enabled.

Keep unlimited bandwidth, SSL, CDN, security, backup/restore, DNS, file-management, and supported migration capabilities enabled where the package platform supports them.
