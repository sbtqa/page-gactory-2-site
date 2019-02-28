$.getJSON("https://api.github.com/repositories/172893709/contents/releases", function (data) {
    const options = [];
    $.each(data, function (key, version) {
        options.push(version.name);
    });
    $('#versions').selectmenu({
        change: function (event, ui) {
            $('#doc').attr("src", `releases/${ui.item.value}/index.html`);
        }
    });
    $('#versions')
        .append(options.map(function (version) { return `<option value="${version}">${version}</option>` }).join(""));

    $('#versions').val(options[0]);
    $('#versions').selectmenu("refresh");
    $('#doc').attr("src", `releases/${options[0]}/index.html`);
});