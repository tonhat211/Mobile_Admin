import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet,View, ActivityIndicator,TouchableOpacity,TextInput,FlatList } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../BaseStyle/Style';
import Icon from 'react-native-vector-icons/Ionicons';



export default function Account() {
  const [studentList, setStudentList] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');

  const data = [
    { label: 'Sinh viên', value: 'student' },
    { label: 'Giáo viên', value: 'teacher' }
];
  const yearData = [
    { label: 'Năm 2024', value: '2024' },
    { label: 'Năm 2023', value: '2023' },
    { label: 'Năm 2022', value: '2022' },
    { label: 'Năm 2021', value: '2021' },
    { label: 'Năm 2020', value: '2020' },
    { label: 'Năm 2019', value: '2019' },
    { label: 'Năm 2018', value: '2018' }
  ];

  useEffect(() => {
    
    setSelectedValue(data[0].value);
    setShowYearSelector(data[0].value === 'student'); 
    if(setShowYearSelector) setSelectedYear(yearData[0].value);
    
  }, []);

  const handleDropdownChange = (item) => {
    setSelectedValue(item.value);
    setShowYearSelector(item.value === 'student'); 
    setIsLoading(true); 
    // Hàm để xử lý API và hiển thị lỗi nếu không có dữ liệu
    const handleApiResponse = (val) => {
        if (val) {
            setSubjectClassAll(val);  // Cập nhật subjectClassAll với dữ liệu trả về
        } else {
            // Hiển thị thông báo lỗi nếu không có dữ liệu
            Toast.show({
                type: 'error',
                text1: 'Có lỗi xảy ra!',
                text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
                visibilityTime: 2000,
                autoHide: true,
            });
        }
    };
    getRegisterSubjectClass(item.value)
    .then(handleApiResponse)
    .finally(() => setIsLoading(false));
 
};

const handleYearDropdownChange = (item) => {
  setSelectedValue(item.value);
  setShowYearSelector(item.value === 'student'); 
  setIsLoading(true); 
  // Hàm để xử lý API và hiển thị lỗi nếu không có dữ liệu
  const handleApiResponse = (val) => {
      if (val) {
          setSubjectClassAll(val);  // Cập nhật subjectClassAll với dữ liệu trả về
      } else {
          // Hiển thị thông báo lỗi nếu không có dữ liệu
          Toast.show({
              type: 'error',
              text1: 'Có lỗi xảy ra!',
              text2: 'Không thể lấy dữ liệu từ trang ĐKMH',
              visibilityTime: 2000,
              autoHide: true,
          });
      }
  };
  getRegisterSubjectClass(item.value)
  .then(handleApiResponse)
  .finally(() => setIsLoading(false));

};

  const StudentListContainer = ({ item }) => {
    console.log("render student list");
    return (
      <View style={styles.subjectContainer} key={program.semesterID}>
        <Text style={styles.examTitle}>{`Mã học kỳ: ${program.semesterID}`}</Text>
        <View style={styles.row}>
          <Text style={styles.cell}>MSSV</Text>
          <Text style={styles.cellName}>Họ và tên</Text>
          <Text style={styles.cell}>Khoa</Text>
          <Text style={styles.cell}>Khóa</Text>
        </View>
        <FlatList
          data={program.subjects}
          renderItem={({ item }) => renderStudentInfo(item, program.semesterID)}  // Pass subject item along with semesterID
          keyExtractor={(subject) => `${program.semesterID}-${subject.id}`}  // Unique key for each subject
        />
      </View>
    );
  }

  const renderStudentInfo = (exam) => {
    return (
      <View style={styles.row} key={`${semesterID}-${subject.id}`}>
      <Text style={styles.cell}>{subject.id}</Text>
      <Text style={styles.cellName}>{subject.name}</Text>
      <Text style={styles.cell}>{subject.credit}</Text>
      <Text style={styles.cell}>{subject.group}</Text>
    </View>
    );
  };

return (
  <View style={styles.container}>
  <Dropdown
    style={styles.dropdown}
    data={data}
    labelField="label"
    valueField="value"
    placeholder="Chọn học kỳ"
    value={selectedValue}
    onChange={handleDropdownChange} 
  />   
  {showYearSelector && (
    <Dropdown
    style={styles.dropdown}
    data={yearData}
    labelField="label"
    valueField="value"
    placeholder="Chọn năm"
    value={selectedYear}
    onChange={handleYearDropdownChange} 
  />   
  )}   
  {/* <ExamScheduleContainer item={exams} /> */}
   {isLoading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2bc250" />
    </View>
  ) : (
    <></>
    // <ExamScheduleContainer item={exams} />
  )}
 
</View>


);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 16
},
dropdown: {
  marginTop: 5,
  width: '100%',
  height: 40,
  borderWidth: 1,
  borderColor: 'black',
  borderRadius: 10,
  paddingHorizontal: 10,
  justifyContent: 'center',
  alignItems: 'center',
},
examScheduleContainer: {
  marginTop: 16,
},
examTitle: {
  fontSize: 18,
  fontWeight: 'bold',
},
examScheduleText: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 8,
},
  subjectsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},
subjectContainer: {
width: '100%', 
marginBottom: 8,
padding: 8,
borderWidth: 1,
borderColor: colors.borderColor, 
borderRadius: 8,
backgroundColor: colors.backgroundColor,
shadowColor: '#000',
shadowOffset: { width: 0, height: 3 },
shadowOpacity: 0.2,
shadowRadius: 4,
elevation: 5,
},
scoreContainer: {
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' , marginTop: 10
},
scoreItem: {
flex: 1, textAlign: 'left'
},

row: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  padding: 10,
},
cell: {
  flex: 1,
  textAlign: 'center',
},
cellName: {
  flex: 3,
  paddingHorizontal: 10,
},

loadingContainer: {
  position: 'absolute',
  zIndex: 1,
  backgroundColor: '#bec4c2',
  top: '50%',
  left: '50%',
  transform: [{ translateX: -75 }, { translateY: 0 }],
  width: 150,
  height: 150,
  justifyContent: 'center',
  borderRadius: 10,
  opacity: 0.8,
},
searchContainer: {
  flexDirection: 'row', 
  alignItems: 'center', 
  width: '90%',
  marginTop: 16, 
},
searchBox: {
  flexDirection: 'row', 
  alignItems: 'center', 
  width: '90%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,  
},
searchIcon: {marginHorizontal: 8 },
searchInput: {flex: 1,padding: 4,},
searchCancel: {
  flex: 1, // Để container chiếm toàn bộ chiều cao và chiều rộng của view cha
  justifyContent: "center", // Căn giữa theo chiều dọc
  alignItems: "center",
},

});
