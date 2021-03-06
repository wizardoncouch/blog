<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Bridal Gallery">
    <meta name="author" content="NST Pictures Cebu">
    <meta name="csrf-token" content="{{ csrf_token() }}" />

    <title>BG</title>
    <!-- Application CSS -->
    <link href="/css/app.css" rel="stylesheet" type="text/css">

</head>

<body>
<router-view></router-view>

<!-- Tinymce -->
<script type="text/javascript" src="/tinymce/tinymce.min.js"></script>

<!-- Vendor -->
<script src="/js/vendor.js"></script>

<!-- Page specific Javascript-->
<script src="/js/admin.js"></script>

</body>

</html>
