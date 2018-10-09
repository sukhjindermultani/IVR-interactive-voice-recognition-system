<?php
$username = "root";
$password = "";
$hostname = "localhost"; 

//connection to the database
$dbhandle = mysql_connect($hostname, $username, $password)
  or die(mysql_error());
$selected = mysql_select_db("eivr_db",$dbhandle)
  or die("Could not connect eivr_db");
?>