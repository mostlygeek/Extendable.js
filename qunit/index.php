<!DOCTYPE html>
<html>
<head>
    <title>qUnit tests for Extendable.js</title>
    <link rel="stylesheet" href="qunit.css" type="text/css" media="screen">
    <script type="text/javascript" src="qunit.js"></script>
    <?php if (!isset($_GET['v'])): ?>
    <script type="text/javascript" src="../sources/Extendable.js"></script>
    <?php else:?>
    <script type="text/javascript" src="../releases/<?php echo $_GET['v']?>"></script>
    <?php endif;?>

    <script type="text/javascript" src="tests/test-Extendable.js"></script>
    <script type="text/javascript" src="tests/test-Extendable-tree.js"></script>
    <script type="text/javascript" src="tests/test-Extendable-events.js"></script>
</head>
<body>
    <h1 id="qunit-header">Extendable.js tests</h1>
    <h2 id="qunit-banner"></h2>
    <div id="qunit-testrunner-toolbar"></div>
    <h2 id="qunit-userAgent"></h2>
    <ol id="qunit-tests"></ol>
</body>
</html>
