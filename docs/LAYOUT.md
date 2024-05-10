# Navigation layout
To meet the needs of different systems, four navigation layouts are provided:
- Head menu
- Left-hand menu
- Head + Left Menu
- Tab page method

## Change the way
- Users can select this through the Settings page in the upper right corner of the page header (if you have provided this page for users);
- Developers can specify the layout by modifying 'src/config';

## No navigation is required
Some pages may not need to display navigation, which can be set in one of the following ways:

- The page is configured with advanced components
    ```js
    @config({
        header: false,
        side: false,
        pageHeader: false,
        tab: false,
    })
    ```

Annotation:

1. Tab is based on the page address whenever used `this.props.history.push('/some/path')`，A new tab will be selected or opened（`/path` and `/path?name=Tom` belongs to different URL addresses, which will correspond to two tab pages);
1. There is no page corresponding to the menu, you need to set the title separately, otherwise the tab tab cannot be displayed;

