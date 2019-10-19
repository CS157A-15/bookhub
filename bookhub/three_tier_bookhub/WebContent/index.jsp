<%@ page import="java.sql.*" %>
<html>
<head>
    <title>Books Table</title>
</head>
<body>
<h1>Computer Science Books</h1>
<%
    String db = "cs157a"; //or root
    String user = "root"; // assumes database name is the same as username
    try {
        java.sql.Connection con;
        Class.forName("com.mysql.cj.jdbc.Driver");
        con = DriverManager.getConnection("jdbc:mysql://localhost/"+db, user, "Maninderpal51");
        String query = "select * from books";
        Statement stmt=con.createStatement();
        ResultSet resultset = stmt.executeQuery(query);
%>
<TABLE BORDER="1">
    <TR>
        <TH>Author</TH>
        <TH>Name</TH>
        <TH>Edition</TH>
    </TR>
    <% while(resultset.next()){ %>
    <TR>
        <TD> <%= resultset.getString(1) %></td>
        <TD> <%= resultset.getString(2) %></TD>
        <TD> <%= resultset.getString(3) %></TD>
    </TR>
    <% }
    }
    catch(SQLException e) {
        out.println("SQLException caught: " +e.getMessage());
    }
    %>

</TABLE>

</body>
</html>
