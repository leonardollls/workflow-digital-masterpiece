-- =====================================================
-- SCRIPT DE EXPORTAÇÃO DE DADOS DO PROJETO ANTIGO
-- =====================================================
-- Execute este script no projeto ANTIGO (sphiqzwnkuzfiwejjlav)
-- para gerar os dados em formato JSON que serão importados

-- =====================================================
-- 1. EXPORTAR CLIENT_BRIEFINGS
-- =====================================================
COPY (
  SELECT json_agg(row_to_json(t))
  FROM (
    SELECT 
      id,
      company_name,
      business_segment,
      company_description,
      current_website,
      target_audience,
      competitive_advantage,
      landing_page_goal,
      responsible_name,
      product_name,
      product_description,
      main_benefits,
      price_range,
      guarantees,
      call_to_action,
      lead_destination,
      main_competitors,
      customer_pain_points,
      success_stories,
      social_proof,
      target_results,
      urgency_factors,
      objections,
      brand_personality,
      communication_tone,
      key_messages,
      desired_domain,
      brand_colors,
      logo_files,
      has_logo,
      visual_references,
      visual_files,
      content_materials,
      material_files,
      integrations,
      analytics_tracking,
      domain_info,
      start_date,
      deadline,
      budget,
      proposal_value,
      proposal_date,
      additional_notes,
      number_of_offers,
      offer_details,
      pricing_model,
      landing_page_sections,
      specific_requirements,
      created_at,
      updated_at
    FROM client_briefings
    ORDER BY created_at DESC
  ) t
) TO '/tmp/client_briefings_export.json';

-- =====================================================
-- 2. EXPORTAR INSTITUTIONAL_BRIEFINGS
-- =====================================================
COPY (
  SELECT json_agg(row_to_json(t))
  FROM (
    SELECT 
      id,
      company_name,
      business_segment,
      company_description,
      company_history,
      mission,
      vision,
      values,
      current_website,
      website_goal,
      website_type,
      main_functionalities,
      required_pages,
      navigation_structure,
      content_hierarchy,
      services_products,
      team_info,
      certifications,
      awards_recognition,
      case_studies,
      testimonials,
      target_audience,
      competitive_advantage,
      main_competitors,
      customer_pain_points,
      customer_objections,
      communication_tone,
      key_messages,
      brand_personality,
      brand_colors,
      logo_files,
      has_logo,
      visual_references,
      visual_files,
      design_style,
      content_materials,
      material_files,
      social_proof,
      success_stories,
      target_conversion,
      user_experience_goals,
      content_strategy,
      contact_forms,
      integrations,
      seo_requirements,
      analytics_tracking,
      hosting_preferences,
      domain_info,
      budget,
      start_date,
      deadline,
      proposal_value,
      proposal_date,
      additional_notes,
      specific_requirements,
      responsible_name,
      created_at,
      updated_at
    FROM institutional_briefings
    ORDER BY created_at DESC
  ) t
) TO '/tmp/institutional_briefings_export.json';

-- =====================================================
-- 3. EXPORTAR CLIENT_UPLOADS (metadados)
-- =====================================================
COPY (
  SELECT json_agg(row_to_json(t))
  FROM (
    SELECT 
      id,
      client_name,
      client_email,
      client_company,
      project_description,
      file_name,
      file_original_name,
      file_size,
      file_type,
      file_url,
      storage_bucket,
      storage_path,
      upload_status,
      notes,
      created_at,
      updated_at
    FROM client_uploads
    WHERE upload_status = 'completed'
    ORDER BY created_at DESC
  ) t
) TO '/tmp/client_uploads_export.json';

-- =====================================================
-- 4. EXPORTAR PORTFOLIO_IMAGES
-- =====================================================
COPY (
  SELECT json_agg(row_to_json(t))
  FROM (
    SELECT 
      id,
      project_id,
      project_title,
      project_description,
      project_category,
      original_url,
      thumbnail_url,
      webp_url,
      blur_data_url,
      original_width,
      original_height,
      thumbnail_width,
      thumbnail_height,
      file_size_original,
      file_size_thumbnail,
      priority,
      is_active,
      created_at,
      updated_at
    FROM portfolio_images
    WHERE is_active = true
    ORDER BY created_at DESC
  ) t
) TO '/tmp/portfolio_images_export.json';

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================
-- 1. Execute este script no projeto ANTIGO via SQL Editor
-- 2. Os arquivos JSON serão gerados em /tmp/
-- 3. Baixe os arquivos JSON
-- 4. Execute o script import-data-to-new-project.sql no projeto NOVO
-- 5. Ajuste os caminhos dos arquivos JSON no script de importação

