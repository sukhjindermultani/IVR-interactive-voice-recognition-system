<?php
include_once("db.php");
//$callbackmethod=$_GET['callback'];
echo 'hello';
    $email=$_POST['username'];
    $password=$_POST['password'];
	$arr=array();
	     $str = "select id,name,pic from users where (WEB_USER_NAME='".$email."' and WEB_USER_PASSWORD='".$password."') and IS_BLOCKED = N";		
		$query = mysql_query($str);
		$value = mysql_fetch_object($query);
		print_r($value);
		exit();
		// $arr['user_id']=$user_id = $value->id;
		// $arr['username'] = ucwords($value->name);

		// if(empty($value->pic))
  //       {
		// 	if(!empty($value->name))
	 //        {
		//           $findSpace = strpos($value->name," ");
		//           if($findSpace)
		//           {
		//            $explodeName = explode(" ",$value->name);
		          
		//            $A = substr($explodeName[0], 0, 1);
		//            $B = substr($explodeName[1], 0, 1);
		//            $arr['user_imageName'] = strtoupper($A.$B); 
		//            $arr['pic'] = "";
		//           } 
		//           else
		//           {
		//            $A = substr($value->name, 0, 1);
		//            $arr['user_imageName'] = strtoupper($A);
		//            $arr['pic'] = "";          
		//           }
	 //        }
	 //    }
	 //    else
  //       {
  //           $arr['pic'] = $value->pic;
  //           $arr['user_imageName'] = "";
  //       }

		// if(mysql_num_rows($query)>0)
		// {

		// 	session_start();
		// 	$session_id = session_id();
		// 	$sql2 = "insert into widgetusersession(user_id,session_id,status) values(".$user_id.",'".$session_id."',1)";
		// 	$query2 = mysql_query($sql2);
		// 	$arr['msg'] = "Success";
		// 	$arr['session_id']=$session_id;
		// 	//resetAppUsersession($user_id); 
		// 	//$sql2 = "update usersession set status = 0 where user_id = ".$user_id."";
  //       	//$query2 =  mysql_query($sql2);			
		// } 
  //       else
  //       {
  //           $arr['msg'] = "Wrong username/password";
  //       }
	
		
	// $json = json_encode($arr);
	// $data=$callbackmethod.'(';
	// $data = $data.$json; 
	// $data = $data.')';
	// print_r($data); 

   
  
?>