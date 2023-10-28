/**
 * Update wiki dialog
 * @param {Element} wikiOuter - Target element
 */
function updateIssueNotesOnContextMenuDialog(wikiOuter) {
  const $wikiOuter = wikiOuter;
  function updateDialogTitle($wikiOuter) {
    const $wiki = $wikiOuter.children(".wiki");
    // Countermeasure if dialog is already closed
    if ($wikiOuter.dialog("instance")) {
      $wikiOuter.dialog("option", "title", $wiki.data("title"));
    }
  }

  function updateDialogButtons($wikiOuter) {
    const $wiki = $wikiOuter.children(".wiki");
    const journalIdCurrent = $wiki.data("journalId");
    const journalIds = $wiki.data("journalIds");
    const currentPos = journalIds.indexOf(journalIdCurrent);
    const journalIdNext =
      currentPos < journalIds.length - 1 ? journalIds[currentPos + 1] : null;
    const journalIdPrev =
      currentPos - 1 >= 0 ? journalIds[currentPos - 1] : null;

    const $btnGroup = $wikiOuter
      .parent()
      .find(".ui-dialog-titlebar-button-group");

    const $btnPrev = $btnGroup.find(".btn-prev");
    $btnPrev
      .attr({
        href: journalIdPrev
          ? `/product/issue_notes_on_context_menus/${journalIdPrev}`
          : "",
      })
      .button({
        disabled: journalIdPrev === null,
      });

    const $btnNext = $btnGroup.find(".btn-next");
    $btnNext
      .attr({
        href: journalIdNext
          ? `/product/issue_notes_on_context_menus/${journalIdNext}`
          : "",
      })
      .button({
        disabled: journalIdNext === null,
      });
  }

  updateDialogTitle($wikiOuter);
  updateDialogButtons($wikiOuter);
}

(() => {
  setTimeout(() => {
    let dialogWidth = 400;
    let dialogHeight = 300;

    /**
     * Check if target is notes context menu
     * @param {Element} target - Target element
     * @returns {boolean} True if target is notes context menu
     */
    function isIssueNotesOnContextMenu(target) {
      return $(target).closest(".issue_notes_on_context_menu").length > 0;
    }

    /**
     * Close wiki dialog
     */
    function closeWiki() {
      if ($(".issue_notes_on_context_menu_wiki_outer").dialog("instance")) {
        $(".issue_notes_on_context_menu_wiki_outer").dialog("destroy");
        $("body").removeClass("issue_notes_on_context_menu_wiki_maximized");
      }
    }

    /**
     * Try closing wiki dialog
     * @param {Event} event - Click or contextmenu event
     */
    function tryCloseWiki(event) {
      if (isIssueNotesOnContextMenu(event.target)) return;
      closeWiki();
    }

    /**
     * Calculate best dialog position
     * @param {Element} target - Target element
     * @param {number} width - Dialog width
     * @param {number} height - Dialog height
     * @returns {[string, string]} CSS position strings
     */
    function calcBestDialogPosition(target, width, height) {
      const rect = target.getBoundingClientRect();
      const overFlowRight = window.innerWidth - rect.right < width;
      const overFlowBottom = window.innerHeight - rect.bottom < height;

      const posMy =
        (overFlowRight ? "right" : "left") +
        " " +
        (overFlowBottom ? "bottom" : "top");
      const posAt =
        (overFlowRight ? "left" : "right") +
        " " +
        (overFlowBottom ? "bottom" : "top");

      return [posMy, posAt];
    }

    /**
     * Create empty wiki dialog
     * @param {Element} target - Target element
     * @param {jQuery} wikiOuter - Outer element of wiki
     */
    function createEmptyDialog(target, wikiOuter) {
      const [posMy, posAt] = calcBestDialogPosition(
        target,
        dialogWidth,
        dialogHeight
      );

      $(wikiOuter).dialog({
        width: dialogWidth,
        height: dialogHeight,
        position: { my: posMy, at: posAt, of: target },
        classes: {
          "ui-dialog": "issue_notes_on_context_menu",
        },
        title: "Now loading...",
        create: function () {
          const $dialogContent = $(this);

          // Add buttons
          const $dialog = $dialogContent.parent();
          const $titleBar = $dialog.find(".ui-dialog-titlebar");

          const $btnPrev = $("<a>")
            .addClass("btn-prev")
            .attr({
              href: "",
              "data-remote": "true",
              "data-method": "get",
            })
            .button({
              icon: "ui-icon-caret-1-w",
              label: "prev",
              showLabel: false,
              disabled: true,
            });

          const $btnNext = $("<a>")
            .addClass("btn-next")
            .attr({
              href: "",
              "data-remote": "true",
              "data-method": "get",
            })
            .button({
              icon: "ui-icon-caret-1-e",
              label: "next",
              showLabel: false,
              disabled: true,
            });

          const $btnMaximize = $("<button>")
            .addClass("ui-button ui-corner-all ui-widget ui-button-icon-only")
            .addClass("maximize mui-icon")
            .attr("title", "maximize")
            .on("click", (e) => {
              const $dialog = $(e.target).closest(
                ".ui-dialog.issue_notes_on_context_menu"
              );
              $dialog.addClass("maximized");
              $("body").addClass("issue_notes_on_context_menu_wiki_maximized");
            });

          const $btnRestore = $("<button>")
            .addClass("ui-button ui-corner-all ui-widget ui-button-icon-only")
            .addClass("restore mui-icon")
            .attr("title", "restore")
            .on("click", (e) => {
              const $dialog = $(e.target).closest(
                ".ui-dialog.issue_notes_on_context_menu"
              );
              $dialog.removeClass("maximized");
              $("body").removeClass(
                "issue_notes_on_context_menu_wiki_maximized"
              );
            });

          const $btnGroup = $("<div>").addClass(
            "ui-dialog-titlebar-button-group"
          );

          $btnGroup
            .append($btnPrev)
            .append($btnNext)
            .append($btnMaximize)
            .append($btnRestore)
            .appendTo($titleBar);
        },
        resizeStop: (_, ui) => {
          dialogWidth = ui.size.width;
          dialogHeight = ui.size.height;
        },
      });
    }

    /**
     * Open wiki dialog
     * @param {Event} event - Mouseover event
     */
    function openWikiDialog(event) {
      const target = event.target;
      const $wikiOuter = $(".issue_notes_on_context_menu_wiki_outer");
      const $wiki = $wikiOuter.children(".wiki");
      if ($wiki.length === 0) {
        console.warn("Target wiki is not found.");
        return;
      }

      const journalIdInit = $wikiOuter.data("journalIdInit");
      if (journalIdInit === undefined) return;

      createEmptyDialog(target, $wikiOuter);

      if ($wiki.hasClass("empty")) {
        $.get(
          `/product/issue_notes_on_context_menus/${journalIdInit}.js`,
          () => {
            const $wiki = $wikiOuter.children(".wiki");
            if ($wiki.length === 0) return;

            $wiki.removeClass("empty");
          }
        );
      } else {
        updateIssueNotesOnContextMenuDialog($wikiOuter);
      }
    }

    /**
     * Override original context menu functions
     */
    (function override() {
      try {
        const contextMenuClickOrg = contextMenuClick;
        contextMenuClick = function (event) {
          if (isIssueNotesOnContextMenu(event.target)) return;
          tryCloseWiki(event);
          contextMenuClickOrg(event);
        };

        const contextMenuRightClickOrg = contextMenuRightClick;
        contextMenuRightClick = function (event) {
          if (isIssueNotesOnContextMenu(event.target)) return;
          tryCloseWiki(event);
          contextMenuRightClickOrg(event);
        };

        const contextMenuCreateOrg = contextMenuCreate;
        contextMenuCreate = function () {
          contextMenuCreateOrg();
          /**
           * Add event listeners
           */
          (function addEvents() {
            $("#context-menu")
              .on(
                "mouseenter",
                "ul > li.issue_notes_on_context_menu",
                openWikiDialog
              )
              .on(
                "mouseenter",
                "ul > li:not(.issue_notes_on_context_menu)",
                tryCloseWiki
              );
          })();
        };
      } catch {
        console.error(
          "[Redmine Notes On Context Menu] " +
            "Failed to initialize the context-menu."
        );
        return;
      }
    })();
  });
})();
