package site.chat.helper.object;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

import java.beans.PropertyDescriptor;
import java.util.ArrayList;
import java.util.List;

public class NullAwareBeanUtils {

    public static void copyNonNullProperties(Object input, Object target) {
        // Sao chép thuộc tính từ source sang target, bỏ qua các thuộc tính null
        BeanUtils.copyProperties(input, target, getNullPropertyNames(input));
    }

    private static String[] getNullPropertyNames(Object input) {
        final BeanWrapper src = new BeanWrapperImpl(input);

        // Lấy danh sách các thuộc tính của source
        PropertyDescriptor[] pds = src.getPropertyDescriptors();

        // Danh sách chứa các thuộc tính null
        List<String> nullProperties = new ArrayList<>();

        // Duyệt qua từng đối tượng của source
        for (PropertyDescriptor pd : pds) {

            // Giá trị hiện tại
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) {
                // Nếu null, đưa vào danh sách
                nullProperties.add(pd.getName());
            }
        }
        return nullProperties.toArray(new String[0]);
    }
}