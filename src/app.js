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
   
    const latestRelease = options.length > 1 ? options[options.length - 2] : "snapshot";
    
    $('#versions').val(latestRelease);
    $('#versions').selectmenu("refresh");
    $('#doc').attr("src", `releases/${latestRelease}/index.html`);
});
