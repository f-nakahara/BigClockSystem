<?php
    $func = $_POST["func"];
    if($func == "sendScore"){
        recordScore($_POST["diff_time_list"]);
    }

    function recordScore($diff_time_list){
        $file_path = "./../admin/score.txt";
        foreach($diff_time_list as $term => $diff_time){
            $text = $term.":".$diff_time.", ";
            file_put_contents($file_path,$text,FILE_APPEND);
        }
        file_put_contents($file_path,"\n",FILE_APPEND);
    }
?>