## Prerequisites

What I need before running the project :

- the Shopify CLI : https://shopify.dev/themes/tools/cli/installation
- Liquid VScode extension : https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid
- Shopify Liquid extension : https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode

Here we use Shopify Liquid Extension only to have control over theme-check (which is bundled with Shopify CLI), see the vscode settings file `themeCheck` for details.
We use Liquid VSCode extension for the autocompletion of the liquid syntax as the Shopify Liquid is buggy for that for now.

The configuration of the tools is done automatically by those files :

- liquidrc
- prettierrc.json
- .vscode/settings.json
