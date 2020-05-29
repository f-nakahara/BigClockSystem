<?php
    $func = $_POST["func"];
    if($func == "sendScore"){
        recordScore($_POST["diff_time_list"]);
    }
    function recordScore($diff_time_list){
        date_default_timezone_set('Asia/Tokyo');
        $file_path = "./../admin/score.txt";
        $date = date("Y/m/d H:i ");
        file_put_contents($file_path,$date,FILE_APPEND);
        foreach($diff_time_list as $term => $diff_time){
            $text;
            if($diff_time != "miss!"){
                $text = $term.":".$diff_time.", ";
            }
            else{
                $text = $term.":"."miss!".", ";
            }
            file_put_contents($file_path,$text,FILE_APPEND);
            print($diff_time);
        }
        file_put_contents($file_path,"\n",FILE_APPEND);
    }
?>