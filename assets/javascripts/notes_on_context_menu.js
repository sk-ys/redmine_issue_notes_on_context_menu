(() => {
  setTimeout(() => {
    function isNotesOnContextMenu(target) {
      return $(target).closest(".notes_on_context_menu").length > 0;
    }

    try {
      const contextMenuClickOrg = contextMenuClick;
      contextMenuClick = function (event) {
        if (isNotesOnContextMenu(event.target)) return;
        contextMenuClickOrg(event);
      };

      const contextMenuRightClickOrg = contextMenuRightClick;
      contextMenuRightClick = function (event) {
        if (isNotesOnContextMenu(event.target)) return;
        try {
          $(".notes_on_context_menu.wiki").dialog("destroy");
        } catch {}
        contextMenuRightClickOrg(event);
      };
    } catch {
      console.error(
        "[Redmine Notes On Context Menu] " +
          "Failed to initialize the context-menu."
      );
      return;
    }

    function closeWiki() {
      if ($(".notes_on_context_menu.wiki").dialog("instance")) {
        $(".notes_on_context_menu.wiki").dialog("destroy");
      }
    }

    $(document)
      .on("click", function (event) {
        if (isNotesOnContextMenu(event.target)) return;
        try {
          $(".notes_on_context_menu.wiki").dialog("destroy");
        } catch {}
      })
      .on(
        "mouseover",
        "#context-menu > ul > li.notes_on_context_menu",
        function () {
          const $wiki = $(this).children(".wiki");

          const dialogWidth = 400;
          const dialogHeight = 300;

          const rect = this.getBoundingClientRect();
          const overFlowRight = window.innerWidth - rect.right < dialogWidth;
          const overFlowBottom =
            window.innerHeight - rect.bottom < dialogHeight;

          const posMy =
            (overFlowRight ? "right" : "left") +
            " " +
            (overFlowBottom ? "bottom" : "top");
          const posAt =
            (overFlowRight ? "left" : "right") +
            " " +
            (overFlowBottom ? "bottom" : "top");

          $wiki.dialog({
            width: dialogWidth,
            height: dialogHeight,
            position: { my: posMy, at: posAt, of: this },
            classes: {
              "ui-dialog": "notes_on_context_menu",
            },
            title: $wiki.data("title"),
          });
        }
      )
      .on(
        "mouseover",
        "#context-menu > ul > li:not(.notes_on_context_menu)",
        closeWiki
      );
  });
})();
