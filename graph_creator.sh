#!/bin/bash

INPUT_FILES=PATH-TO-PROJECT-FOLDER/MB_GraphGen/Texts/*          #Path for the directory where text files are stored/*
DATAFILES=PATH-TO-PROJECT-FOLDER/MB_GraphGen/DataFiles/   #Path for the directory where data files should be stored/
GRAPHS=PATH-TO-PROJECT-FOLDER/MB_GraphGen/Graphs/         #Path for the directory where .png files should be stored/

interim_file=PATH-TO-PROJECT-FOLDER/MB_GraphGen/searched.txt  #New file path for the intermediate operations
interim_file1=PATH-TO-PROJECT-FOLDER/MB_GraphGen/searched1.txts
#--------------------------------------------------------
# Take action on each file and $f store current file name
#--------------------------------------------------------
for f in $INPUT_FILES
do 
    filename="${f##*/}"
    instant_sufix=INST
    avg_time_length=0                #Variable to keep length of the avg_time array
    sample_length=0
    data_file_path="$DATAFILES$filename"
    data_file_path1="$DATAFILES$instant_sufix$filename"
    > $data_file_path
    > $data_file_path1
   
    index_num=$( echo $(expr index "$filename" .))          #Get index of "."
    index_num=$((index_num-1))
    
    new_file_nam=$( echo $filename | cut -c1-"$index_num")  #Get new name as path without extension
    new_sufix=$(echo '.png')  
    
    png_file_path="$GRAPHS$new_file_nam$new_sufix"          #Add extension .png 
    > $png_file_path   
   
    > $interim_file
    egrep "^summary =" $f > $interim_file                   #Get the files begin with summary and creare file searched.txt
    > $interim_file1
    egrep "^summary \+" $f > $interim_file1
    #-------------------------------------
    #read the file line by line
    #------------------------------------
    while IFS= read line
    do
       
        replaced_line="${line/\/s/''}"         #Replace /s in each line    
        count=0
        for word in $replaced_line
        do
            word_array[$count]=$word; 
            count=$((count+1))
        done
        avg_time[$avg_time_length]=$word_array[6]};
        sample_num[$avg_time_length]=$avg_time_length;
       
        echo "$avg_time_length ${word_array[6]}" >> $data_file_path         #Write graph data into file
        avg_time_length=$((avg_time_length+1))
    done <"$interim_file"
    
    while IFS= read line
    do
      
        replaced_line="${line/\/s/''}"      #Replace /s in each line    
       
        count=0     
        for word in $replaced_line
        do
            word_array[$count]=$word; 
            count=$((count+1))
        done
        avg_time[$sample_length]=${word_array[6]};
        sample_num[$sample_length]=$sample_length;
        
        echo "$sample_length ${word_array[6]}" >> $data_file_path1      #Write graph data into file
        sample_length=$((sample_length+1))
    done <"$interim_file1"
    
     cat << __EOF | gnuplot
set xlabel "SAMPLE_NUMBER"
set ylabel "AVERAGE_VALUES"        
set term png font arial 14 size 1500,800
set output "$png_file_path"
plot "$data_file_path" with lines title "Cumulative_Average", \
"$data_file_path1" with lines title "Instant_Average"
__EOF
done

